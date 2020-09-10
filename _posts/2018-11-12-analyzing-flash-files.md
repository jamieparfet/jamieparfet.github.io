---
layout: post
title: Analyzing Flash Applications for Vulnerabilities
published: true
---

This post demonstrates how to perform basic analysis on Flash applications (SWF files) to identify client-side vulnerabilities such as Open Redirects and Reflected Cross-site Scripting.

This setup has only been testing on Debian-based Linux distributions such as Ubuntu and Kali.

---

## Step 1: Install Flash
The following script will download the latest version of Flash and place it in Firefox's plugins directory.

<script src="https://gist.github.com/jamieparfet/994e9cae784aa68409d4f384f8f9f73c.js"></script>

You may also want to install the Flash debugger as it will provide you with the ability to log Flash trace messages, although that will not be covered this post. In order to install the debugger, run the above script and pass it the argument `debug`:

`./install-flash-for-firefox.sh debug`

## Step 3: Install the JPEXS Decompiler
The JPEXS Decompiler is an open-source GUI tool for decompiling and analyzing SWF files. It provides command-line support which is extremely useful for automation.

The JPEXS Decompiler depends on Oracle's Java 8, which can be installed using the following script (*UPDATE - Oracle now requires you to register and signin in order to download `jdk-8u221-linux-x64.tar.gz` - I recommend you run each command in this script manually*):
<script src="https://gist.github.com/jamieparfet/79451dff1f6e10d95dbf660513ce695e.js"></script>

Once Java is installed, go to the JPEXS Decompiler's <a href="https://github.com/jindrapetrik/jpexs-decompiler/releases/" target="_blank">releases</a> page. Grab the link for the latest Debian package and install it:
```bash
$ wget https://github.com/jindrapetrik/jpexs-decompiler/releases/download/version11.3.0/ffdec_11.3.0.deb
$ dpkg -i ffdec*.deb
```

## Step 3: Manual Analysis
Let's use IBM as an example, as they run a <a href="https://hackerone.com/ibm" target="_blank">public vulnerability disclosure program</a> through HackerOne. A simple Google search returns a large number of SWF files:
```
site:ibm.com filetype:swf
```

One of the first files in the Google results is `https://www.ibm.com/ibm/ideasfromibm/ru/stockholm/stockholm.swf`. We will use this as an example target.

In order to keep everything organized, create a new directory to store the SWF files from IBM.
```bash
$ mkdir ibm/
```
Download the target SWF file to the newly created directory. 
```bash
$ wget -qO ibm/stockholm.swf https://www.ibm.com/ibm/ideasfromibm/ru/stockholm/stockholm.swf
```
The target SWF file can then be decompiled with the JPEXS Decompiler. The following command will only export scripts from the target SWF file, and write the output to the `ibm/stockholm/` 
```bash
$ ffdec -export script ibm/stockholm/ ibm/stockholm.swf
```

So how do we analyze the resulting files for vulnerabilities? The first step is to look for commonly vulnerable methods. <a href="https://ret2libc.wordpress.com/2016/04/04/analysing-swf-files-for-vulnerabilities/" target="_blank">This blog post</a> is a great resource for information about common Flash vulnerabilities.

Let's grep the extracted ActionScript files for some of the vulnerable methods listed in the blog post from above.

```bash
$ find ibm/ -type f -iname "*.as" -exec grep --color -inE 'getURL|loadMovie|XML\.load' {} +

DefineButton2_162/on(release).as:2:   getUrl("http://www.ibm.com/podcasts/howitworks/040207/images/HIW_04022007.pdf", "_self");
__Packages/mx/core/ExternalContent.as:39:            _loc2_.obj.loadMovie(_loc2_.url);
__Packages/mx/video/SMILManager.as:14:      this.xml.load(url);
```

The output above suggests that this Flash application may utilize some user-supplied URL parameters, although we need to examine the source code to determine if this is actually the case. Open the folder containing the extracted scripts in Sublime:

```
/opt/sublime_text/sublime_text ibm/stockholm/scripts/
```

In order to test this Flash application for vulnerabilites, you will have to read the source code to determine how `xml.load()` is being used and whether the `url` variable can be manipulated. Flash applications will commonly read configuration data from an XML file.

## Step 4: Automation
I wrote a small bash script to automate much of the process outlined above:

<script src="https://gist.github.com/jamieparfet/ad311276c72706e11c0d10d42d4a0b03.js"></script>

Here is a short summary of its intended usage:
```bash
# Download a single Flash file
./analyze.sh -u http://ibm.com/movie.swf -o ibm/

# Download a list of Flash files
./analyze.sh -L /path/to/list-of-urls.txt -o ibm/

# Analyze output directory
./analyze.sh -a ibm/

# Use a custom string for grepping the output directory
./analyze.sh -a ibm/ -g 'password|apikey'
```
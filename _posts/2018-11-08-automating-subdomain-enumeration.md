---
layout: post
title: Automating Subdomain Enumeration with Aquatone and Amass
published: true
---

This post goes over the basic installation and usage of two popular subdomain enumeration tools, Aquatone and Amass, and provides a simple Bash script to automate their usage and push the results to GitHub for easier analysis.

## Background

Subdomain enumeration is an essential part of bug hunting. At a high level, there are basically two subdomain enumeration methods: passive and active.

Passive enumeration methods *do not* engage a target domain or its subdomains directly and are typically achieved by querying various open data sources to identify as many potential subdomains as possible. Active enumeration methods, on the other hand, *do* engage a target domain directly and may involve brute forcing subdomains and port scanning any that are discovered.

There are dozens of open-source subdomain enumeration tools available on the internet, but I have found that Aquatone and Amass consistently outperform other tools by finding the highest number of subdomains in the shortest amount of time. Also considering Aquatone's screenshotting capabilities, there is no question that it is one of the best tools for the job.

### Regarding Aquatone: Go or Ruby?
Aquatone was originally written in Ruby with the capability of querying a decent variety of different data sources to identify potential subdomains. When [@michenriksen](https://twitter.com/michenriksen) rewrote Aquatone entirely in Go, he dropped the subdomain enumeration functionality in order to focus more on the visual inspection and analysis of subdomains. Both versions of Aquatone are extremely good at what they do, so we will use both.

---

# Part 1: Setup and Installation
This section will walk through the setup, installation, and usage of Aquatone Ruby, Aquatone Go, and Amass.

## Step 1: Aquatone Ruby
Import RVM's keys and install RVM.
```
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
$ curl -sSL https://get.rvm.io | bash -s stable --ruby
```

Clone the Aquatone Ruby version.
```
$ git clone --single-branch --branch ruby https://github.com/michenriksen/aquatone.git
```

*Please note that you will have to update some of the collectors in* `lib/aquatone/collectors/` *for them to work properly. For example, the PTRarchive.com collector uses an outdated search URL and does not include the cookie necessary for avoiding bot detection.*

Install Aquatone Ruby.
```
$ cd aquatone/
$ gem install bundler
$ bundle install
$ gem build aquatone
$ gem install aquatone
```
If you get an error, you might need to source RVM.
```
$ source ~/.rvm/scripts/rvm
```

Once Aquatone Ruby is successfully installed, you will have to create the ```~/aquatone/.keys.yml``` file to store your credentials and API keys that Aquatone Ruby will use to collect data from various sources. 
```
---
virustotal: 1234567890123456789012345678901234567890123456789012345678901234
riddler_username: user@example.com
riddler_password: s3cr3t-h4ck3r-p4ssw0rd
censys_id: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m5n6o7p
censys_secret: 1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p
passivetotal_key: user@example.com
passivetotal_secret: '1234567890123456789012345678901234567890123456789012345678901234'
shodan: 1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p
```

### Usage
The `aquatone-discover` tool queries a variety of common data sources to identify subdomains. It allows you to specify options such as the number of threads, time to sleep between lookups, and much more.
```bash
$ aquatone-discover --threads 25 --fallback-nameservers 1.1.1.1,8.8.8.8,9.9.9.9,208.67.222.222 --domain example.com
```
In order to remain passive, you must disable dictionary-based brute forcing by providing the argument `--disable-collectors dictionary`.

---

## Step 2: Amass
The easiest way to install Amass is through [Snap](https://snapcraft.io/).
```
$ sudo snap install amass
```

### Usage
Amass allows you to specify the output directory with the `-o` argument.

```bash
$ amass -d example.com -ip -o ~/aquatone
```

---

## Step 3: Aquatone Go

Aquatone Go relies on Chromium to take screenshots of webpages. Install Chromium and other dependencies before installing Aquatone Go.
```
$ sudo apt install -y unzip golang chromium-browser
```

Create the Go directory where the Aquatone binary will be stored and place it in your path.
```
$ mkdir -p $HOME/go/bin
$ echo "export PATH=$PATH:$HOME/go/bin" >> ~/.profile
```

Download the [latest](https://github.com/michenriksen/aquatone/releases/latest) Aquatone Go binary and place it in your Go path.
```
$ wget https://github.com/michenriksen/aquatone/releases/download/v1.3.2/aquatone_linux_amd64_1.4.2.zip
$ unzip aquatone_linux_amd64_1.4.2.zip
$ mv aquatone $HOME/go/bin
$ rm aquatone*.zip
```

### Usage
Aquatone Go is made to be flexible and can ingest data from a file or straight from another tool's output. For this example, imagine you have a text file named `hosts.txt` that contains a list of hostnames (most likely gathered from running one of the previous tools). All you need to do is pipe the file to Aquatone Go and the tool will work its magic.
```bash
$ cat ~/aquatone/example.com/hosts.txt | aquatone -ports 80,443,8080 -out ~/aquatone/example.com
```

---


# Part 2: Automation
This section will walkthrough setting up a GitHub repository to receive the subdomain scan results generated by the tools from the previous sections.

## Step 1: GitHub

Generate a new SSH key on the server that will be performing the scans ([relevant guide](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)). Do not enter a password when prompted.

```
$ ssh-keygen -t rsa -b 4096 -C "user@example.com"
```

Add the key to your GitHub account under **Settings > SSH and GPG keys > [New SSH key](https://github.com/settings/ssh/new)**.
```
$ cat ~/.ssh/id_rsa.pub
```

Create a repository on GitHub (you will probably want to make it private). Do not initialize it with any files. The repository used in this example is called ```enumeration-results```.

Back on the server, configure Git to use your GitHub username and email address if you haven't already.
```
$ git config --global user.name "github-username"
$ git config --global user.email "5028417+github-username@users.noreply.github.com"
```

Create the required Aquatone directory.
```
$ mkdir ~/aquatone
$ cd ~/aquatone
```

Initialize the repository in the ```~/aquatone``` directory.
```
$ echo "# Subdomain Enumeration and Discovery Scan Results" >> README.md
$ git init
$ git add README.md
$ git commit -m "first commit"
$ git remote add origin git@github.com:github-username/enumeration-results.git
$ git push -u origin master
``` 

---

## Step 2: Automation Script
Here is a fairly straightforward Bash script to automate everything discussed so far.

```bash
#!/bin/bash

ports="80,81,443,2082,2095,2096,3000,5000,8000,8001,8008,8080,8081,8118,8083,8443,8834,8880,8888,55672"

usage () {
    echo -e "Usage: $0 OPTIONS"
    echo -e "  -d <domain>      Target domain"
    echo -e "  -n               Do not push results to GitHub"
}

# Get options
while getopts ":d:n" option; do
    case "${option}" in
        d) domain=${OPTARG};;
        n) no_github=true;;
        *) usage; exit;;
    esac
done
shift "$((OPTIND-1))"

# Only run if -d argument is supplied
if [ $domain ]; then
    printf "========================================\n"
    printf "[+] PHASE 1: Running Aquatone (Ruby) discover module to identify subdomains\n"

    # Aquatone (Ruby) discover command using resolvers:
    # Cloudflare, Google, Quad9, and OpenDNS
    aquatone-discover --threads 25 --fallback-nameservers 1.1.1.1,8.8.8.8,9.9.9.9,208.67.222.222 --domain ${domain}

    # Rename file for consistency
    mv ~/aquatone/${domain}/hosts.txt ~/aquatone/${domain}/aquatone-hosts.txt

    printf "\n[+] PHASE 1: Complete\n"
    printf "\n[+] PHASE 2: Running Amass to identify subdomains\n\n"

    # Amass discovery command
    amass -d ${domain} -ip -o ~/aquatone/${domain}/amass-hosts.txt

    printf "\n[+] PHASE 2: Complete\n"
    printf "\n[+] Sorting and combining results..."

    # Manipulate text files by removing IP from all lines like (example.com,8.8.8.8) and combine results
    sed 's/,.*//g' ~/aquatone/${domain}/aquatone-hosts.txt ~/aquatone/${domain}/amass-hosts.txt | sort -u > ~/aquatone/${domain}/combined-hosts.txt

    printf "\n[+] Done.\n"
    printf "\n[+] PHASE 3: Running Aquatone (Go) scanner on $(wc -l ~/aquatone/${domain}/combined-hosts.txt | cut -d " " -f 1) unqiue subdomains\n\n"

    # Aquatone (Go) scan command. Writes to file but also displays on screen
    cat ~/aquatone/${domain}/combined-hosts.txt | aquatone -threads 5 -http-timeout 3000 -scan-timeout 500 -screenshot-timeout 15000 -ports ${ports} -out ~/aquatone/${domain} | tee ~/aquatone/${domain}/aquatone-scan-output.txt

    printf "[+] PHASE 3: Complete\n"

    # Get all URLs along with their status codes
    grep -e '^http:\/\/\|^https:\/\/' ~/aquatone/${domain}/aquatone-scan-output.txt | grep -v ': screenshot' | sort -u > ~/aquatone/${domain}/aquatone-scan-urls.txt

    # Check if -n switch was given
    if [ $no_github ]; then
        printf "\n[+] Results will not be pushed to GitHub."
    else
        # Push the results to Github
        printf "\n[+] PHASE 4: Pushing results to GitHub\n\n"

        git add ~/aquatone/${domain}/aquatone_report.html
        git add ~/aquatone/${domain}/headers/*
        git add ~/aquatone/${domain}/html/*
        git add ~/aquatone/${domain}/screenshots/*
        git add ~/aquatone/${domain}/aquatone-scan-urls.txt
        git commit -m "$(date "+%F %T") ${domain}"
        git push -u origin master
    fi
    printf "\n[+] Done\n"
else
    # If the -d argument is not given, throw error
    printf "\n[-] Error: please supply a domain using the -d argument"
fi

```

Here is a breakdown of the script in case you're too lazy to figure it out:
1. Run `aquatone-discover`, output results to `~/aquatone/example.com/aquatone-hosts.txt`
2. Run `amass`, output results to `~/aquatone/example.com/amass-hosts.txt`
3. Remove IP addresses from the results
4. Combine the results from both tools into `~/aquatone/example.com/combined-hosts.txt`
5. Pipe the combined results to Aquatone Go
6. Scan the defined ports and attempt to screenshot open ports using Aquatone Go
8. Push results to GitHub

---

# Future Steps
* Setup cron to run automation script periodically
* Write another script to compare results and check for new subdomains, as well as major changes to a site's HTML or headers
* Send push notifications using Slack

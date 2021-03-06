---
layout: post
title: Automating Subdomain Enumeration and Analysis
published: true
---

> *This was updated in January 2020 after the release of subfinder 2.0*

Subdomain enumeration is an essential part of bug hunting. Unfortunately, it can quickly become overwhelming if a particular target has thousands of hosts. Being able to quickly identify interesting web applications across large environments allows you to spend more time looking for bugs and less time analyzing your results.

The objective of this post is to provide some basic groundwork for security researchers and bug bounty hunters to automate the process of analyzing the web-based attack surface for a large number of hosts by utilizing the following tools:

* subfinder - subdomain enumeration using passive data sources
* Aquatone - visual inspection of websites and provides a simple Bash script to automate their usage and push the results to GitHub for easier analysis.

---

# Part 1: Setup and Installation
This section will walk through the setup, installation, and usage of subfinder and Aquatone.

## Step 1: Install golang
go is required to run the tools used in this post. The latest stable version of go can be found <a href="https://golang.org/dl/" target="_blank" rel="noopener noreferrer">here</a>.

Download the latest stable version for Linux:
```bash 
$ wget https://dl.google.com/go/go1.13.7.linux-amd64.tar.gz
```

Extract the archive and move it to the proper location:
```bash
$ sudo tar -xvf go*.linux-amd64.tar.gz
$ sudo mv go /usr/local
```

Add the necessary `export` commands to your `.bashrc` script so that the environment varibles used by go are set each time you login and initialize a shell. This may be different depending on your setup.
```bash
$ echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
$ echo 'export GOPATH=$HOME/go' >> ~/.bashrc
$ echo 'export PATH=$GOPATH/bin:$GOROOT/bin:$PATH' >> ~/.bashrc
```

Finally, execute the updated login script to set the proper environment variables and then test that go is properly installed.
```bash
$ source ~/.bashrc
$ go version
```

## Step 2: subfinder

Install subfinder using go's built-in functionality:

```bash
$ go get github.com/projectdiscovery/subfinder/cmd/subfinder
```

To test the installation, simply run `subfinder` with no arguments. A sample config file will automatically be created at `~/.config/subfinder/config.yaml`. This config file stores credentials and API keys that the tool uses to collect data from various <a href="https://github.com/projectdiscovery/subfinder/tree/master/pkg/subscraping/sources" target="_blank" rel="noopener noreferrer">sources</a>.

```yaml
resolvers:
  ...
sources:
  ...
binaryedge:
  - 1234ab56-7c8d-9012-e34f-ghi12j3456k7
censys:
  - username:1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p
certspotter:
  - 1234_AbCdeFGhi1JKL2m3NopQ
passivetotal:
  - user@example.com:p4ssw0rd
securitytrails:
  - 1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p
shodan:
  - 1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p
urlscan:
  - 1234ab56-7c8d-9012-e34f-ghi12j3456k7
virustotal:
  - 1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p1A2b3C4d5E6f7G8h9I0j1K2l3M5n6O7p
```

### Usage
Subfinder allows you to specify options such as what sources to query (or exclude), which resolvers to use, the number of concurrent threads, and more.

```bash
$ subfinder -t 20 -exclude-sources securitytrails -d example.com -o hosts.txt
```

---

## Step 3: Aquatone

Install Aquatone using go's built-in functionality:
```bash
$ go get github.com/michenriksen/aquatone
```

Aquatone relies on Chromium to take screenshots of webpages, which can be installed with apt:
```
$ sudo apt install -y chromium-browser
```

### Usage
Aquatone can ingest data from a file or straight from stdout, which is quite useful when working with other tools. Aquatone allows you to specify which ports to scan, various timeout options, and more.
```bash
$ cat hosts.txt | aquatone -threads 20 -ports 80,443,8080 -screenshot-timeout 15000 -out output.txt
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

Create a repository on GitHub (you will probably want to make it private). Do not initialize it with any files. The repository used in this example is called `subdomain-enumeration`.

Back on the server, configure Git to use your GitHub username and email address if you haven't already.
```
$ git config --global user.name "github-username"
$ git config --global user.email "5028417+github-username@users.noreply.github.com"
```

Create the required directory.
```
$ mkdir ~/subdomain-enumeration
$ cd ~/subdomain-enumeration
```

Initialize the git repository in the `~/subdomain-enumeration` directory.
```
$ echo "# Subdomain Enumeration and Discovery Scan Results" >> README.md
$ git init
$ git add README.md
$ git commit -m "first commit"
$ git remote add origin git@github.com:<github-username>/subdomain-enumeration.git
$ git push -u origin master
``` 

---

## Step 2: Automation Script
To automate everything discussed so far, here is a simple Bash script, which will perform the following actions:

1. Create a directory for the program and target domain if they do not already exist.
2. Run subfinder on the target domain.
2. Run Aquatone on the subfinder results.
3. Sort the results for easier analysis.
4. Push the results to GitHub.

```bash
#!/bin/bash

_ports="80,81,443,3000,5000,5555,8000,8001,8008,8080,8081,8118,8083,8443,8444,8834,8880,8888,55672"
_output_dir="/home/ubuntu/subdomain-enumeration/"

usage () {
    echo -e "Usage: $0 OPTIONS"
    echo -e "  -p <program>     Name of program"
    echo -e "  -d <domain>      Target domain"
}

# Get options
while getopts ":p:d:" option; do
    case "${option}" in
        p) _program=${OPTARG};;
        d) _domain=${OPTARG};;
        *) usage; exit;;
    esac
done
shift "$((OPTIND-1))"


if [ -z $_domain ] || [ -z $_program ]; then
    echo "ERROR: Missing required arguemnts."
    exit 1
fi

if ! [ -d $_output_dir ]; then
    echo "ERROR: Output directory does not exist."
    exit 1
fi

printf "========================================\n"

cd ${_output_dir}

printf "Updating git repo...\n"
git pull

# Create directories if they do not exist
mkdir -p ${_output_dir}/${_program}/${_domain}

printf "[+] PHASE 1: Running subfinder to identify subdomains\n"

subfinder -d ${_domain} -t 20 -o ${_output_dir}/${_program}/${_domain}/hosts-subfinder.txt

printf "\n[+] PHASE 1: Complete\n"

printf "\n[+] PHASE 2: Running Aquatone on $(wc -l ${_output_dir}/${_program}/${_domain}/hosts-subfinder.txt | cut -d " " -f 1) unqiue subdomains\n\n"

# writes to a temporary file but also displays on screen
cat ${_output_dir}/${_program}/${_domain}/hosts-subfinder.txt \
  | aquatone -threads 10 -http-timeout 3000 -screenshot-timeout 15000 -ports ${_ports} -out ${_output_dir}/${_program}/${_domain}/ \
  | tee ${_output_dir}/${_program}/${_domain}/aquatone-scan-output.txt

printf "[+] PHASE 2: Complete\n"

# extract all the URLs along with their status codes from the temporary file
grep -e '^http:\/\/\|^https:\/\/' ${_output_dir}/${_program}/${_domain}/aquatone-scan-output.txt \
  | grep -v ': screenshot' \
  | sort -u > ${_output_dir}/${_program}/${_domain}/url-status-codes.txt

# remove temporary file
rm ${_output_dir}/${_program}/${_domain}/aquatone-scan-output.txt

# sort headers to make them easier to find unique values in GitHub
find ${_output_dir}/${_program}/${_domain}/headers/ \
    -type f -exec sort {} -o {} \; \
    -exec sed -i '/Date: /d' {} \;

printf "\n[+] PHASE 4: Pushing results to GitHub\n\n"

cd ${_output_dir}

git add ${_output_dir}/${_program}/${_domain}/aquatone_report.html
git add ${_output_dir}/${_program}/${_domain}/headers/*
git add ${_output_dir}/${_program}/${_domain}/html/*
git add ${_output_dir}/${_program}/${_domain}/screenshots/*
git add ${_output_dir}/${_program}/${_domain}/url-status-codes.txt
git add ${_output_dir}/${_program}/${_domain}/all-discovered-domains.txt
git commit -m "$(date "+%F %T") ${_program}/${_domain}"
git push -u origin master

printf "\n[+] Done\n"

```

---

# Conclusion

Bug bounties are highly competitive. When a new program opens or a target scope is updated, the difference between a large payday and the sheer disappointment that accompanies a duplicate bug can be a matter of minutes. Heavy automation is critical if you want to succeed.

If you are just getting into bug bounties, I wish you the best of luck! Take this sample script as inspiration to think about how your workflow can be automated. You should never find yourself spending more time organzing and analyzing the output from your tools than you do actually looking for bugs.

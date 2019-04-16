Language support for YANG for Visual Studio Code
=====================

Provides [YANG](https://tools.ietf.org/html/rfc7950) language support via
[YANG Language Server](https://github.com/theia-ide/yang-lsp).

Quick Start
============
1. Install the Extension
2. If you do not have a _Java 8_ correctly installed
    * Download and install a Java 8 runtime environment.
3. Extension is activated when you first access a YANG file

Features
=========
![ templates ](https://raw.githubusercontent.com/theia-ide/yang-vscode/master/images/yang-templates.gif)
![ completion ](https://raw.githubusercontent.com/theia-ide/yang-vscode/master/images/yang-completion.gif)
![ navigation ](https://raw.githubusercontent.com/theia-ide/yang-vscode/master/images/yang-navigation.gif)

* As you type reporting of parsing and compilation errors
* Code completion
* `description` hovers
* Symbol search
* Code outline
* Code navigation
* Code lens (references)
* Highlights
* Code formatting
* Code snippets
* Code actions

Configuration
=============
For configuration and further services, please have a look at the [docs of the YANG Language Server](https://github.com/theia-ide/yang-lsp/tree/master/docs).

Publishing
==========

Once you have the Personal Access Token configured as described [here](https://code.visualstudio.com/docs/extensions/publish-extension), publishing is a matter of calling

```bash
npm install      # will also download the latest YANG LS from Jenkins
vi package.json  # update the version number manually
vsce publish
```
 
on the command line.

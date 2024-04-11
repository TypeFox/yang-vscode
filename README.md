YANG Language Server support for Visual Studio Code
===================================================

Provides [YANG][yang1.1] language support via [YANG Language Server][yang-lsp].

Quick Start
-----------

1. Install the Extension
2. If you do not have a _Java 11_ correctly installed
    * Download and install a Java 11 runtime environment.
3. Extension is activated when you first access a YANG file
4. Use "Open in Diagram" from the context menu to see the graphical model view.

Features
--------

![ templates ](https://raw.githubusercontent.com/TypeFox/yang-vscode/master/images/yang-templates.gif)
![ completion ](https://raw.githubusercontent.com/TypeFox/yang-vscode/master/images/yang-completion.gif)
![ navigation ](https://raw.githubusercontent.com/TypeFox/yang-vscode/master/images/yang-navigation.gif)
<!-- markdownlint-disable MD033 MD013 -->
<img src="https://raw.githubusercontent.com/TypeFox/yang-vscode/master/images/yang-diagram.png" width="480" alt=""/>
<!-- markdownlint-enable MD033 MD013 -->

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
* Diagrams

Configuration
-------------

For configuration and further services, please have a look at the
[docs of the YANG Language Server][yang-lsp-docs].

[yang1.1]: https://tools.ietf.org/html/rfc7950
[yang-lsp]: https://github.com/TypeFox/yang-lsp
[yang-lsp-docs]: https://github.com/TypeFox/yang-lsp/tree/master/docs

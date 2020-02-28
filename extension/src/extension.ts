/*
 * Copyright (C) 2017-2020 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as path from 'path';
import * as os from 'os';
import { workspace, commands, Uri, ExtensionContext } from 'vscode';
import {
    LanguageClient, LanguageClientOptions, ServerOptions, Position as LSPosition, Location as LSLocation
} from 'vscode-languageclient';
import { SprottyVscodeLanguageExtension, SprottyDiagramIdentifier, SprottyWebview, SprottyLanguageWebview } from 'sprotty-vscode/lib';

let extension: SprottyVscodeLanguageExtension | undefined;

export function activate(context: ExtensionContext) {
    extension = new YangLanguageExtension(context);
}

export function deactivate(): Thenable<void> {
    if (!extension) {
        return Promise.resolve();
    }
    const result = extension.deactivateLanguageClient();
    extension = undefined;
    return result;
}

export class YangLanguageExtension extends SprottyVscodeLanguageExtension {

    constructor(context: ExtensionContext) {
        super('yang', context);
    }

    protected getDiagramType(): string {
        return 'yang-diagram';
    }

    createWebView(identifier: SprottyDiagramIdentifier): SprottyWebview {
        return new SprottyLanguageWebview({
            extension: this,
            identifier,
            localResourceRoots: ['webview/yang-sprotty-vscode/pack'],
            scriptPath: 'webview/yang-sprotty-vscode/pack/bundle.js'
        });
    }

    protected activateLanguageClient(context: ExtensionContext): LanguageClient {
        const executable = os.platform() === 'win32' ? 'yang-language-server.bat' : 'yang-language-server';
        const serverModule = context.asAbsolutePath(path.join('server', 'bin', executable));

        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions: ServerOptions = {
            run: {
                command: serverModule
            },
            debug: {
                command: serverModule,
                args: ['-Xdebug', '-Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y', '-Xmx256m']
            }
        }

        // Options to control the language client
        const clientOptions: LanguageClientOptions = {
            // Register the server for plain text documents
            documentSelector: ['yang'],
            synchronize: {
                // Synchronize the setting section 'yangLanguageServer' to the server
                configurationSection: 'yangLanguageServer',
                // Notify the server about file changes to '.yang files contain in the workspace
                fileEvents: workspace.createFileSystemWatcher('**/*.yang')
            }
        }

        // Create the language client and start the client.
        const languageClient = new LanguageClient('yangLanguageServer', 'Yang Language Server', serverOptions, clientOptions);
        const disposable = languageClient.start()

        commands.registerCommand('yang.show.references', (uri: string, position: LSPosition, locations: LSLocation[]) => {
            commands.executeCommand('editor.action.showReferences',
                        Uri.parse(uri),
                        languageClient.protocol2CodeConverter.asPosition(position),
                        locations.map(languageClient.protocol2CodeConverter.asLocation));
        })

        commands.registerCommand('yang.apply.workspaceEdit', (obj: any) => {
            const edit = languageClient.protocol2CodeConverter.asWorkspaceEdit(obj);
            if (edit) {
                workspace.applyEdit(edit);
            }
        });

        // Push the disposable to the context's subscriptions so that the
        // client can be deactivated on extension deactivation.
        context.subscriptions.push(disposable);

        return languageClient;
    }
}

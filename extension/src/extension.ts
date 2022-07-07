/*
 * Copyright (C) 2017-2020 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import { SprottyDiagramIdentifier, SprottyWebview } from 'sprotty-vscode';
import { SprottyLspVscodeExtension, SprottyLspWebview } from 'sprotty-vscode/lib/lsp';
import { commands, ExtensionContext, Uri, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, Location as LSLocation, Position as LSPosition, ServerOptions, StreamInfo } from 'vscode-languageclient/node';

let extension: SprottyLspVscodeExtension | undefined;

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

// Use DEBUG true to connect via Socket to server at port: 5008
const DEBUG = false;
const SERVER_PORT = 5008;

export class YangLanguageExtension extends SprottyLspVscodeExtension {

    constructor(context: ExtensionContext) {
        super('yang', context);
    }

    protected getDiagramType(): string {
        return 'yang-diagram';
    }

    createWebView(identifier: SprottyDiagramIdentifier): SprottyWebview {
        return new SprottyLspWebview({
            extension: this,
            identifier,
            localResourceRoots: [this.getExtensionFileUri('webview', 'pack')],
            scriptUri: this.getExtensionFileUri('webview', 'pack', 'bundle.js')
        });
    }

    protected activateLanguageClient(context: ExtensionContext): LanguageClient {
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
        const clientId = {id: 'yangLanguageServer', name: 'Yang Language Server'};
        // Create the language client and start the client.
        const languageClient = DEBUG
        ? getSocketLanguageClient(clientId, clientOptions, SERVER_PORT)
        : getStdioLanguageClient(clientId, clientOptions, context);
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

function getStdioLanguageClient(clientId: {id: string, name: string}, clientOptions: LanguageClientOptions, context: ExtensionContext): LanguageClient {
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
            args: ['-Xdebug', '-Xnoagent', '-Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y', '-Xmx256m']
        }
    }
    return new LanguageClient(clientId.id, clientId.name, serverOptions, clientOptions);
}

function getSocketLanguageClient(clientId: {id: string, name: string}, clientOptions: LanguageClientOptions, serverPort: number): LanguageClient {
    const serverOptions: ServerOptions = () => {
        const socket = net.connect({ port: serverPort });
        const result: StreamInfo = {
            writer: socket,
            reader: socket
        };
        return Promise.resolve(result);
    };
    return new LanguageClient(clientId.id, clientId.name, serverOptions, clientOptions);
}
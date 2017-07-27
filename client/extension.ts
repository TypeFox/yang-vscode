/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

'use strict';

import * as path from 'path';
import * as cp from 'child_process';
import * as os from 'os';
import {
    workspace,
    commands,
    Disposable,
    Uri,
    ExtensionContext
} from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    SettingMonitor,
    ServerOptions,
    TransportKind,
    Position as LSPosition, Location as LSLocation
} from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

    // The server is implemented in node
    let executable = os.platform() === 'win32' ? 'yang-language-server.bat' : 'yang-language-server';
    let serverModule = context.asAbsolutePath(path.join('out', 'build', 'yang-language-server', 'bin', executable));

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions: ServerOptions = {
        run: {
            command: serverModule
        },
        debug: {
            command: serverModule,
            args: ['-Xdebug', '-Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y', '-Xmx256m']
        }
    }

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
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
    let languageClient = new LanguageClient('yangLanguageServer', 'Yang Language Server', serverOptions, clientOptions);
    let disposable = languageClient.start()

    commands.registerCommand('yang.show.references', (uri: string, position: LSPosition, locations: LSLocation[]) => {
        commands.executeCommand('editor.action.showReferences',
                    Uri.parse(uri),
                    languageClient.protocol2CodeConverter.asPosition(position),
                    locations.map(languageClient.protocol2CodeConverter.asLocation));
    })

    commands.registerCommand('yang.apply.workspaceEdit', (obj) => {
        let edit = languageClient.protocol2CodeConverter.asWorkspaceEdit(obj);
        if (edit) {
            workspace.applyEdit(edit);
        }
    });

    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}
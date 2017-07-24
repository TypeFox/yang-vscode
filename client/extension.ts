'use strict';

import * as path from 'path';
import * as cp from 'child_process';
import * as os from 'os';
import {
	workspace,
	Disposable,
	ExtensionContext
} from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	SettingMonitor,
	ServerOptions,
	TransportKind
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
	let disposable = new LanguageClient('yangLanguageServer', 'Yang Language Server', serverOptions, clientOptions).start();

	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);
}
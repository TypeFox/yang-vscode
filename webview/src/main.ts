/*
 * Copyright (C) 2020 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import "reflect-metadata";
import 'yang-sprotty/css/dark/diagram.css';
import 'sprotty-vscode-webview/css/sprotty-vscode.css';
import { Container } from 'inversify';
import { createYangDiagramContainer } from 'yang-sprotty';
import { SprottyDiagramIdentifier, SprottyStarter } from 'sprotty-vscode-webview/lib';

export class YangSprottyStarter extends SprottyStarter {
    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        return createYangDiagramContainer(diagramIdentifier.clientId + '_sprotty');
    }
}

export const starter = new YangSprottyStarter();

import {
	commands,
	window,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import { dataPackages } from '../configuration/configuration';
import { ViewCommands } from './viewCommands';

export async function registerListDataPackagesCommand(context: ExtensionContext) {
	// register list data packages command
	const listDataPackagesCommand: Disposable =
		commands.registerCommand(ViewCommands.listDataPackages, () => {
			// TODO: create custom data package picker
			console.log('data packages:\n', dataPackages);
		});

	context.subscriptions.push(listDataPackagesCommand);
}

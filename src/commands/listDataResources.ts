import {
	commands,
	window,
	Disposable,
	ExtensionContext,
	QuickPickItem,
	Uri
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import { ViewCommands } from './viewCommands';

export async function registerListDataResourcesCommand(context: ExtensionContext) {
	// register list data resources command
	const listDataResourcesCommand: Disposable =
		commands.registerCommand(ViewCommands.listDataResources, (dataPackageUri: Uri) => {
			const dataResources: Array<QuickPickItem> = [];
			// TODO: extract and display tabular data resources
			// from the provided data package Uri
			console.log('dataPackage:', dataPackageUri);
		});
	context.subscriptions.push(listDataResourcesCommand);
}

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

// eslint-disable-next-line @typescript-eslint/naming-convention
const DataPackage = require('datapackage');

export async function registerListDataResourcesCommand(context: ExtensionContext) {
	// register list data resources command
	const listDataResourcesCommand: Disposable =
		commands.registerCommand(ViewCommands.listDataResources, 
			(dataPackageUri: Uri) => listDataResources(dataPackageUri));
	context.subscriptions.push(listDataResourcesCommand);
}

/**
 * Creates and displays Tabular Data Resources quick pick list for a data package.
 */
async function listDataResources(dataPackageUri: Uri): Promise<void> {
	const dataPackage: any = 
		await DataPackage.Package.load(dataPackageUri.toString(true)); // skip encoding
	const dataResources: Array<QuickPickItem> = [];
	// TODO: extract and display tabular data resources
	// from the provided data package Uri
	console.log('dataPackage.resources:', dataPackage.resources);
}

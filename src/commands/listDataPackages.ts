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

import { dataPackages } from '../configuration/configuration';
import { ViewCommands } from './viewCommands';

export async function registerListDataPackagesCommand(context: ExtensionContext) {
	// register list data packages command
	const listDataPackagesCommand: Disposable =
		commands.registerCommand(ViewCommands.listDataPackages, listDataPackages);
	context.subscriptions.push(listDataPackagesCommand);
}

/**
 * Creates and displays Data Packages quick pick list.
 */
async function listDataPackages(): Promise<void> {
	const dataPackageItems: Array<QuickPickItem> = [];
	dataPackages.forEach((dataPackage: any) => {
		const dataRepositoryUrl: string = `https://github.com/${dataPackage.user}/${dataPackage.repo}`;
		dataPackageItems.push({
			label: `$(package) ${dataPackage.title}`,
			description: dataPackage.description,
			detail: `${dataRepositoryUrl}/blob/${dataPackage.branch}/${dataPackage.path}`
		});
	});
	const selectedDataPackage: QuickPickItem | undefined =
		await window.showQuickPick(dataPackageItems, { canPickMany: false });
	if (selectedDataPackage) {
		let dataPackageUrl: string | undefined = selectedDataPackage.detail;
		if (dataPackageUrl) {
			// rewrite github data package url to use raw.githubusercontent
			dataPackageUrl = dataPackageUrl.replace('https://github.com/', 'https://raw.githubusercontent.com/');
			dataPackageUrl = dataPackageUrl.replace('/blob/', '/'); // strip out blob part

			// create public data package Uri and display tabular data resources
			const dataPackageUri: Uri = Uri.parse(dataPackageUrl);
			commands.executeCommand(ViewCommands.listDataResources, dataPackageUri);
		}
	}
}

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
		const dataPackageUrl: string | undefined = selectedDataPackage.detail;
		if (dataPackageUrl) {
			const dataPackageUri: Uri = Uri.parse(dataPackageUrl);
			// TODO: show data package tabular data resources
			// commands.executeCommand(ViewCommands.listDataResources, dataPackageUri);
		}
	}
}

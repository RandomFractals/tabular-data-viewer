import {
	commands,
	window,
	Disposable,
	ExtensionContext,
	QuickPickItem,
	Uri
} from 'vscode';

import * as fileUtils from '../utils/fileUtils';

import { ViewCommands } from './viewCommands';

import { dataPackages } from '../configuration/configuration';


/**
 * Registers Tabular Data: List Data Packages command
 * for the built-in list of demo datasets from public github respositories
 * imported from data packages json configuration file.
 * 
 * @param context Extension context.
 */
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
	// create built-in data packages list
	const dataPackageItems: Array<QuickPickItem> = [];
	dataPackages.forEach((dataPackage: any) => {
		const dataRepositoryUrl: string = `https://github.com/${dataPackage.user}/${dataPackage.repo}`;
		dataPackageItems.push({
			label: `$(package) ${dataPackage.title}`,
			description: dataPackage.description,
			detail: `${dataRepositoryUrl}/blob/${dataPackage.branch}/${dataPackage.path}`
		});
	});

	// display demo data packages
	const selectedDataPackage: QuickPickItem | undefined =
		await window.showQuickPick(dataPackageItems, { canPickMany: false });
	if (selectedDataPackage) {
		let dataPackageUrl: string | undefined = selectedDataPackage.detail;
		if (dataPackageUrl) {
			// create public data package Uri and display tabular data resources
			const dataPackageUri: Uri = Uri.parse(fileUtils.convertToGitHubContentUrl(dataPackageUrl));
			commands.executeCommand(ViewCommands.listDataResources, dataPackageUri);
		}
	}
}

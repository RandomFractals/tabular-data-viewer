import {
	commands,
	window,
	Disposable,
	ExtensionContext,
	QuickPickItem,
	Uri
} from 'vscode';

import { ViewCommands } from './viewCommands';
import { FileTypes } from '../views/fileTypes';
import * as fileUtils from '../utils/fileUtils';

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
 * 
 * @param dataPackageUri Local (file:///) or remote/public (https://) data package uri.
 */
async function listDataResources(dataPackageUri: Uri): Promise<void> {
	// load data package
	const dataPackage: any = 
		await DataPackage.Package.load(dataPackageUri.toString(true)); // skip encoding
	// console.log('tabular.data.package:', dataPackage);
	// console.log('tabular.data.package.resources:', dataPackage.resources);

	// get supported data formats from view file types
	const supportedDataFormats: Array<string> = Object.values(FileTypes);

	// get data package resources
	const dataResources: Array<QuickPickItem> = [];
	dataPackage.resources.forEach((resource: any) => {
		if (resource.tabular) { // supportedDataFormats.includes(resource.descriptor.format)) {
			dataResources.push({
				label: `$(table) ${resource.name}`,
				description: dataPackage.descriptor.title,
				detail: fileUtils.convertToGitHubRepositoryUrl(resource.source)
			});
		}
	});

	// create and display data resources quick pick list
	const selectedDataResource: QuickPickItem | undefined =
		await window.showQuickPick(dataResources, { canPickMany: false });
	if (selectedDataResource) {
		let dataResourceUrl: string | undefined = selectedDataResource.detail;
		if (dataResourceUrl) {
			// create tabular data resource Uri and display a table view
			const dataResourceUri: Uri = Uri.parse(fileUtils.convertToGitHubContentUrl(dataResourceUrl));
			commands.executeCommand(ViewCommands.viewTable, dataResourceUri);
		}
	}
}

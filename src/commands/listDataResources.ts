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

// eslint-disable-next-line @typescript-eslint/naming-convention
const DataPackage = require('datapackage');

/**
 * Registers Tabular Data: List Data Resources command
 * for local and remote datapackage.json configuration files.
 * 
 * @param context Extension context.
 */
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
	if (!dataPackageUri && window.activeTextEditor &&
			window.activeTextEditor.document.fileName.endsWith('datapackage.json')) {
		// use active text editor document Uri
		dataPackageUri = window.activeTextEditor.document.uri;
	}

	// create data package url for loading package info and resource list
	let dataPackageUrl: string = dataPackageUri.toString(true); // skip encoding
	// console.log('tabular.data.package:Url:', dataPackageUrl);
	if (dataPackageUri.scheme === 'file') {
		// use fs path to load data package info
		dataPackageUrl = dataPackageUri.fsPath;
	}

	// load data package
	const dataPackage: any = await DataPackage.Package.load(dataPackageUrl);
	// console.log('tabular.data.package:', dataPackage);
	// console.log('tabular.data.package.resources:', dataPackage.resources);

	// get data package resources
	const dataResources: Array<QuickPickItem> = [];
	dataPackage.resources.forEach((resource: any) => {
		if (resource.tabular &&
				fileUtils.supportedDataFormats.includes(`.${resource.descriptor.format}`)) {
			
			// construct github repository resource Url
			let resourceUrl: string = fileUtils.convertToGitHubRepositoryUrl(resource.source);

			if (dataPackageUri.scheme === 'file') {
				// create local resource path using data package Uri as resource base path
				const resourceUri: Uri = Uri.joinPath(dataPackageUri, `../${resource.source}`);
				resourceUrl = resourceUri.toString(true); // skip encoding
			}

			// add tabular data resource to the list to display
			dataResources.push({
				label: `$(table) ${resource.name}`,
				description: dataPackage.descriptor.title,
				detail: resourceUrl
			});
		}
	});

	if (dataResources.length <= 0) {
		window.showInformationMessage(`There are not tabular data resources listed in \
			\`${dataPackage.descriptor.title}\` data package.\
			Data package Url: ${fileUtils.convertToGitHubRepositoryUrl(dataPackageUrl)}.`);
	}
	else {
		// create and display data resources quick pick list
		const selectedDataResource: QuickPickItem | undefined =
			await window.showQuickPick(dataResources, {
				canPickMany: false,
				title: 'Select Tabular Data Resource to View Table Data'
			});
		
		if (selectedDataResource) {
			let dataResourceUrl: string | undefined = selectedDataResource.detail;
			if (dataResourceUrl) {
				// create tabular data resource Uri and display a table view
				const dataResourceUri: Uri = Uri.parse(fileUtils.convertToGitHubContentUrl(dataResourceUrl));
				commands.executeCommand(ViewCommands.viewTable, dataResourceUri);
			}
		}
	}
}

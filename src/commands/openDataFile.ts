import {
	commands,
	window,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import { ViewCommands } from './viewCommands';
import { FileTypes } from '../views/fileTypes';
import * as fileUtils from '../utils/fileUtils';

export async function registerOpenDataFileCommand(context: ExtensionContext) {
	// register open data file command
	const openDataFileCommand: Disposable =
		commands.registerCommand(ViewCommands.openDataFile, () => {
			window.showInputBox({
				ignoreFocusOut: true,
				placeHolder: 'file:/// or https://',
				prompt: 'Enter Data File or Data Package Url to View Tabular Data'
			}).then((dataFileUrl: string | undefined) => {				
				if (dataFileUrl && dataFileUrl !== undefined && dataFileUrl.length > 0) {
					// create data file Uri
					const dataFileUri: Uri = Uri.parse(fileUtils.convertToGitHubContentUrl(dataFileUrl));

					// check supported data files
					const fileExtension: string = path.extname(dataFileUrl);
					if (!dataFileUrl?.startsWith('file:///') && !dataFileUrl?.startsWith('https://')) {
						window.showErrorMessage(
							`Tabular Data Viewer requires a valid \`file:///\` or \`https://\` data file Url \
							to display Table View. Invalid data document Url: \`${dataFileUrl}\`.`);
					}
					else if (dataFileUrl?.startsWith('file:///') && !fs.existsSync(dataFileUri.fsPath)) {
						window.showErrorMessage(
							`Unable to locate requested data file: \`${dataFileUrl}\`.`);
					}
					else if ((<any>Object).values(FileTypes).includes(fileExtension)) {
						// open table view for requested remote or local data file
						commands.executeCommand(ViewCommands.viewTable, dataFileUri);
					}
					else if (dataFileUrl.endsWith('datapackage.json')) {
						// load and display data package resource list
						commands.executeCommand(ViewCommands.listDataResources, dataFileUri);
					}
					else if (fileExtension.length === 0) {
						window.showErrorMessage(
							`Tabular Data Viewer doesn't support data directory views yet.\
							Use View Table menu option from VSCode File Explorer to open tabular data file in Table View.
							Requested data directory: \`${dataFileUrl}\`.`);
					}
					else {
						window.showErrorMessage(
							`Tabular Data Viewer doesn't support ${fileExtension} data files.\
							Unable to show Table View for data file: \`${dataFileUrl}\`.`);
					}
				}
			});
		});

	context.subscriptions.push(openDataFileCommand);
}

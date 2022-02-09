import {
	commands,
	window,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
import * as fileUtils from '../utils/fileUtils';

import { ViewCommands } from './viewCommands';

/**
 * Registers Tabular Data: Open Data File prompt command
 * for the supported data formats and file types.
 * 
 * @param context Extension context.
 */
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
					const isLocalDataFile: boolean = dataFileUrl?.startsWith('file:///');
					const isRemoteDataFile: boolean = dataFileUrl?.startsWith('https://');
					const fileExtension: string = path.extname(dataFileUrl);
					const isFileDirectory: boolean = (fileExtension.length <= 0);

					// check supported data files and call the corresponding tabular data view command
					if ((!isLocalDataFile && !isRemoteDataFile) ||
							(isRemoteDataFile && isFileDirectory)) {
						window.showErrorMessage(
							`Tabular Data Viewer requires a valid \`file:///\` or \`https://\` Data File Url \
							to display a Table View. Invalid Data Url: \`${dataFileUrl}\`.`);
					}
					else if (isLocalDataFile && !fs.existsSync(dataFileUri.fsPath)) {
						window.showErrorMessage(
							`Unable to locate requested data file: \`${dataFileUrl}\`.`);
					}
					else if (dataFileUrl.endsWith('datapackage.json')) {
						// load and display data package resource list
						commands.executeCommand(ViewCommands.listDataResources, dataFileUri);
					}
					else if (fileUtils.supportedDataFormats.includes(fileExtension)) {
						// open table view for a remote or local data file
						commands.executeCommand(ViewCommands.viewTable, dataFileUri);
					}
					else if (isLocalDataFile && isFileDirectory &&
						fs.existsSync(path.join(dataFileUri.fsPath, 'datapackage.json'))) { 
						// show data resources for a data package from local file directory
						commands.executeCommand(
							ViewCommands.listDataResources, Uri.joinPath(dataFileUri, 'datapackage.json'));
					}
					else if (isLocalDataFile && isFileDirectory) {
						// must be a data directory without the datapackage.json descriptor
						window.showErrorMessage(
							`Tabular Data Viewer doesn't support local data directory views yet.\
							Use View Table menu option from VSCode File Explorer to open tabular data file in Table View.
							Requested data directory: \`${dataFileUrl}\`.`);
					}
					else if (!fileUtils.supportedDataFormats.includes(fileExtension)) {
						// unsupported data format
						window.showErrorMessage(
							`Tabular Data Viewer doesn't support ${fileExtension} data files.\
							Unable to show Table View for a data file: \`${dataFileUrl}\`.`);
					}
				}
			});
		});

	context.subscriptions.push(openDataFileCommand);
}

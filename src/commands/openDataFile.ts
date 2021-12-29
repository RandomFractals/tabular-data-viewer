import {
	commands,
	window,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import * as path from 'path';

import { ViewCommands } from './viewCommands';
import { FileTypes } from '../views/fileTypes';

export async function registerOpenDataFileCommand(context: ExtensionContext) {
	// register open data file command
	const openDataFileCommand: Disposable =
		commands.registerCommand(ViewCommands.openDataFile, () => {
			window.showInputBox({
				ignoreFocusOut: true,
				placeHolder: 'file:///',
				prompt: 'Enter Data File Url'
			}).then((dataFileUrl: string | undefined) => {
				if (dataFileUrl && dataFileUrl !== undefined && dataFileUrl.length > 0) {
					// create data file Uri
					const dataFileUri: Uri = Uri.parse(dataFileUrl);

					// check supported data files
					const fileExtension: string = path.extname(dataFileUrl);
					if ((<any>Object).values(FileTypes).includes(fileExtension)) {
						// open table view for the data file
						commands.executeCommand(ViewCommands.viewTable, dataFileUri);
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

import {
	commands,
	window,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import { ViewCommands } from './viewCommands';

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

					// open table view for the data file
					commands.executeCommand(ViewCommands.viewTable, dataFileUri);
				}
			});
		});

	context.subscriptions.push(openDataFileCommand);
}

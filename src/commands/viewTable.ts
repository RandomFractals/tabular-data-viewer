import {
	commands,
	window,
	Disposable,
	ExtensionContext,
	Uri
} from 'vscode';

import * as path from 'path';
import * as fileUtils from '../utils/fileUtils';

import { ViewCommands } from './viewCommands';
import { TableView } from '../views/tableView';

/**
 * Registers Tabular Data: View Table command for the supported data documents.
 * 
 * @param context Extension context.
 */
export async function registerViewTableCommand(context: ExtensionContext) {
	// register view table command
	const viewTableCommand: Disposable =
		commands.registerCommand(ViewCommands.viewTable, (dataDocumentUri: Uri) => {
			if (!dataDocumentUri && window.activeTextEditor &&
					fileUtils.supportedDataFormats.includes(
						path.extname(window.activeTextEditor.document.fileName))) {
				// use active text editor document Uri
				dataDocumentUri = window.activeTextEditor.document.uri;
			}

			// render table view for the requested data document
			TableView.render(context.extensionUri, dataDocumentUri);
		});

	context.subscriptions.push(viewTableCommand);
}

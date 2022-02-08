import {
	commands,
	window,
	Disposable,
	ExtensionContext,
	Uri
} from 'vscode';

import { ViewCommands } from './viewCommands';
import { TableView } from '../views/tableView';

/**
 * Registers Tabular Data: Open Text Document command
 * to view raw text data file content in vscode editor.
 * 
 * @param context Extension context.
 */
export async function registerOpenTextDocumentCommand(context: ExtensionContext) {
	const openTextDocumentCommand: Disposable =
		commands.registerCommand(ViewCommands.openTextDocument, (textDocumentUri: Uri) => {
			if (!textDocumentUri && TableView.currentView?.documentUri) {
				// use current table view document uri
				textDocumentUri = TableView.currentView.documentUri;
			}

			if (textDocumentUri) {
				// use built-in vscode open command to show text document in code editor
				commands.executeCommand(ViewCommands.vscodeOpen, TableView.currentView?.documentUri);
			}
		});
	
	context.subscriptions.push(openTextDocumentCommand);
}

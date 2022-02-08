import {
	commands,
	ExtensionContext,
	Disposable,
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
		commands.registerCommand(ViewCommands.openTextDocument, () => {
			commands.executeCommand(ViewCommands.vscodeOpen, TableView.currentView?.documentUri);
		});
	context.subscriptions.push(openTextDocumentCommand);
}

import {
	commands,
	window,
	workspace,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import { TableView } from './views/tableView';

/**
 * Activates this extension per rules set in package.json.
 * 
 * @param context vscode extension context.
 * @see https://code.visualstudio.com/api/references/activation-events for more info.
 */
export function activate(context: ExtensionContext) {
	
	console.log('tabular.data.viewer:activate(): activated!');

	let viewTableCommand: Disposable = 
		commands.registerCommand('tabular.data.viewTable', (documentUri: Uri) => {
			TableView.render(context.extensionUri, documentUri);
		});

	context.subscriptions.push(viewTableCommand);
}

/**
 * Deactivates this vscode extension to free up resources.
 */
export function deactivate() {
	// TODO: add extension cleanup code, if needed
}

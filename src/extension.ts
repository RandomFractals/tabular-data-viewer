import {
	commands,
	window,
	workspace,
	ExtensionContext,
	Disposable,
	Uri
} from 'vscode';

import { TableView } from './views/tableView';
import { TableViewSerializer } from './views/tableViewSerializer';
import { ViewTypes } from './views/viewTypes';

/**
 * Activates this extension per rules set in package.json.
 * 
 * @param context vscode extension context.
 * @see https://code.visualstudio.com/api/references/activation-events for more info.
 */
export function activate(context: ExtensionContext) {
	
	console.log('tabular.data.viewer:activate(): activated!');

	// register view table command
	let viewTableCommand: Disposable = 
		commands.registerCommand('tabular.data.viewTable', (documentUri: Uri) => {
			TableView.render(context.extensionUri, documentUri);
		});

	context.subscriptions.push(viewTableCommand);

	// register table view serializer for restore on vscode restart
	window.registerWebviewPanelSerializer(ViewTypes.TableView, 
		new TableViewSerializer(context.extensionUri));
}

/**
 * Deactivates this vscode extension to free up resources.
 */
export function deactivate() {
	// TODO: add extension cleanup code, if needed
}

import { ExtensionContext } from 'vscode';

import { TableEditor } from './views/tableEditor';
import { TableViewSerializer } from './views/tableViewSerializer';
import { registerViewTableCommands } from './commands/viewTable';

/**
 * Activates this extension per rules set in package.json.
 * 
 * @param context Extension context.
 * 
 * @see https://code.visualstudio.com/api/references/vscode-api#extensions
 * @see https://code.visualstudio.com/api/references/activation-events
 */
export function activate(context: ExtensionContext) {
	
	console.log('tabular.data.viewer:activate(): activated!');

	// register view table commands
	registerViewTableCommands(context);

	// register table view serializer for restore on vscode reload
	context.subscriptions.push(TableViewSerializer.register(context));

	// register custom table editor
	context.subscriptions.push(TableEditor.register(context));
}

/**
 * Deactivates this vscode extension to free up resources.
 */
export function deactivate() {
	// TODO: add extension cleanup code, if needed
}

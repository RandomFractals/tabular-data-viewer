import { ExtensionContext, TextEditor, window } from 'vscode';

import { registerOpenDataFileCommand } from './commands/openDataFile';
import { registerViewTableCommand } from './commands/viewTable';
import { registerViewSettingsCommand } from './commands/viewSettings';

import { statusBar } from './views/statusBar';

import { TableEditor } from './views/tableEditor';
import { TableViewSerializer } from './views/tableViewSerializer';
import { PerspectiveEditor } from './views/perspectiveEditor';

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

	// register tabular data viewer commands
	registerOpenDataFileCommand(context);
	registerViewTableCommand(context);
	registerViewSettingsCommand(context);

	// register table view serializer for restore on vscode reload
	context.subscriptions.push(TableViewSerializer.register(context));

	// register custom tabular data editors
	context.subscriptions.push(TableEditor.register(context));
	context.subscriptions.push(PerspectiveEditor.register(context));

	window.onDidChangeActiveTextEditor((textEditor: TextEditor | undefined) => {
		// hide tabular data stats display on active editor change
		statusBar.hide();
	});
}

/**
 * Deactivates this vscode extension to free up resources.
 */
export function deactivate() {
	statusBar.dispose();
}

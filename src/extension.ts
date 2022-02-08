import {
	commands,
	window,
	ExtensionContext,
	TextEditor,
} from 'vscode';

import { registerUriHandler } from './uriHandler';
import { registerTabularDataCommands } from './commands/commands';
import { statusBar } from './views/statusBar';

import { TableEditor } from './views/tableEditor';
import { TableViewSerializer } from './views/tableViewSerializer';
import { PerspectiveEditor } from './views/perspectiveEditor';
import { ViewCommands } from './commands/viewCommands';
import { ViewContexts } from './views/viewContexts';

/**
 * Activates this extension per rules set in package.json.
 * 
 * @param context Extension context.
 * 
 * @see https://code.visualstudio.com/api/references/vscode-api#extensions
 * @see https://code.visualstudio.com/api/references/activation-events
 */
export function activate(context: ExtensionContext) {
	// register tabular data Uri handler and commands
	registerUriHandler(context);
	registerTabularDataCommands(context);

	// register table view serializer for restore on vscode reload
	context.subscriptions.push(TableViewSerializer.register(context));

	// register custom tabular data editors
	context.subscriptions.push(TableEditor.register(context));
	context.subscriptions.push(PerspectiveEditor.register(context));

	window.onDidChangeActiveTextEditor((textEditor: TextEditor | undefined) => {
		// hide tabular data stats display on active editor change
		statusBar.hide();

		// clear tabular data view visible context value
		commands.executeCommand(ViewCommands.setContext, ViewContexts.tableViewVisible, false);
	});
}

/**
 * Deactivates this vscode extension to free up resources.
 */
export function deactivate() {
	statusBar.dispose();
}

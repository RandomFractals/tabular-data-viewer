import {
	commands,
	window,
	ExtensionContext,
	Disposable
} from 'vscode';

import { TableView } from './views/tableView';

export function activate(context: ExtensionContext) {
	
	console.log('tabular.data.viewer:activate(): activated!');

	let viewTableCommand: Disposable = commands.registerCommand('tabular.data.viewTable', () => {
		TableView.render();
	});

	context.subscriptions.push(viewTableCommand);
}

export function deactivate() {}

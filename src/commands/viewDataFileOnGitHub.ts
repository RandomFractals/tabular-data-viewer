import {
	commands,
	Disposable,
	ExtensionContext,
	Uri
} from 'vscode';

import * as fileUtils from '../utils/fileUtils';

import { ViewCommands } from './viewCommands';
import { TableView } from '../views/tableView';

/**
 * Registers Tabular Data: View Data File on GitHub command
 * to view data files from public github repositories in a browser.
 * 
 * @param context Extension context.
 */
export async function registerViewDataFileOnGitHubCommand(context: ExtensionContext) {
	const viewDataFileOnGitHubCommand: Disposable =
		commands.registerCommand(ViewCommands.viewDataFileOnGithub, () => {
			const dataFileUri: Uri | undefined = TableView.currentView?.documentUri;
			if (dataFileUri && dataFileUri.authority === 'raw.githubuserconent.com') {
				commands.executeCommand(ViewCommands.vscodeOpenExternal,
					Uri.parse(fileUtils.convertToGitHubRepositoryUrl(dataFileUri.toString(true)))); // skip encoding
			}
		});
	context.subscriptions.push(viewDataFileOnGitHubCommand);
}

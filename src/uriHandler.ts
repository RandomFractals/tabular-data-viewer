import {
	commands,
	window,
	ExtensionContext,
	Uri,
	UriHandler,
	ProviderResult
} from 'vscode';

import { URLSearchParams } from 'url';

import { extensionId } from './configuration/configuration';
import { ViewCommands } from './commands/viewCommands';

/**
 * Registers tabular data viewer Uri handler for launching table views,
 * and executing other tabular data commands from vscode:// Url links in browser.
 * 
 * @param context Extension context.
 * 
 * @see https://code.visualstudio.com/api/references/vscode-api#window.registerUriHandler
 * @see https://code.visualstudio.com/api/references/activation-events#onUri
 */
export async function registerUriHandler(context: ExtensionContext) {
	const dataUriHanlder: DataUriHandler = new DataUriHandler();
	context.subscriptions.push(window.registerUriHandler(dataUriHanlder));
}

/**
 * Defines Tabular data viewer Uri handler for launching table views,
 * and executing other tabular data commands from vscode:// Url links in a browser.
 * 
 * @see https://code.visualstudio.com/api/references/vscode-api#UriHandler
 */
class DataUriHandler implements UriHandler {

	/**
	 * Handles provided vscode:// Uri.
	 * 
	 * @param uri Data Uri to process.
	 */
	public handleUri(uri: Uri): ProviderResult<void> {
		const query: URLSearchParams = new URLSearchParams(uri.query);
		let dataUrl: string | null = uri.fragment;
		if (!dataUrl) {
			// get data url from query params
			dataUrl = query.get('dataUrl');
		}

		// construct tabular data command
		const command: string = `${extensionId}.${uri.path.replace('/', '')}`;

		// check and execute one of the supported tabular data commands
		switch (command) {
			case ViewCommands.viewSettings:
				commands.executeCommand(ViewCommands.viewSettings);
				break;
			case ViewCommands.listDataPackages:
				commands.executeCommand(ViewCommands.listDataPackages);
				break;
			case ViewCommands.listDataResources:
				if (dataUrl && dataUrl?.length > 0) {
					const dataPackageUri: Uri = Uri.parse(dataUrl);
					commands.executeCommand(ViewCommands.listDataResources, dataPackageUri);
				}
				break;
			case ViewCommands.openDataFile:
				commands.executeCommand(ViewCommands.openDataFile);
				break;
			case ViewCommands.openTextDocument:
				if (dataUrl && dataUrl?.length > 0) {
					const textDocumentUri: Uri = Uri.parse(dataUrl);
					commands.executeCommand(ViewCommands.openTextDocument, textDocumentUri);
				}
				break;
			case ViewCommands.viewTable:
				if (dataUrl && dataUrl?.length > 0) {
					const dataFileUri: Uri = Uri.parse(dataUrl);
					commands.executeCommand(ViewCommands.viewTable, dataFileUri);
				}
				break;
		}
	}
}

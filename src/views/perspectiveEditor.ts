import {
	window,
	CancellationToken,
	CustomTextEditorProvider,
	Disposable,
	ExtensionContext,
	TextDocument,
	WebviewPanel
} from 'vscode';

import { TableView } from './tableView';
import { ViewTypes } from './viewTypes';
import { DataViewTypes } from './dataViewTypes';

/**
 * Defines custom tabular data text editor provider for Perspective viewer.
 * 
 * @see https://github.com/finos/perspective
 * @see https://code.visualstudio.com/api/references/vscode-api#CustomTextEditorProvider
 */
export class PerspectiveEditor implements CustomTextEditorProvider {

	/**
	 * Registers custom Table editor.
	 * 
	 * @see https://code.visualstudio.com/api/references/vscode-api#window.registerCustomEditorProvider
	 * 
	 * @param context Extension context.
	 * @returns Disposable object for this editor.
	 */
	public static register(context: ExtensionContext): Disposable {
		return window.registerCustomEditorProvider(
			ViewTypes.PerspectiveEditor, new PerspectiveEditor(context), {
			webviewOptions: {
				enableFindWidget: true,
				retainContextWhenHidden: true
			}
		});
	}

	/**
	 * Creates new Perspective editor instance.
	 * 
	 * @param context Extension context.
	 */
	constructor(private readonly context: ExtensionContext) {
	}

	/**
	 * Resolves a custom text eidtor for a given tabular data text document source,
	 * and creates new TableView for that table data display.
	 * 
	 * @param document Text document for the tabular data source to resolve.
	 * @param webviewPanel Webview panel used to display the editor UI for this resource.
	 * @param token A cancellation token that indicates the result is no longer needed.
	 */
	public async resolveCustomTextEditor(
		document: TextDocument,
		webviewPanel: WebviewPanel,
		token: CancellationToken
	): Promise<void> {
		// create new table view for the given tabular text data document and render it
		TableView.render(this.context.extensionUri,	document.uri,	webviewPanel, {
			view: DataViewTypes.PerspectiveViewer.toLowerCase()
		});
	}
}

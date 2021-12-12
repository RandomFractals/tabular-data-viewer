import {
  window,
  Disposable,
  ExtensionContext,
  WebviewPanel,
  WebviewPanelSerializer,
  Uri
} from 'vscode';

import { TableView } from './tableView';
import { ViewTypes } from './viewTypes';

/**
 * Table webview panel serializer for restoring table views on vscode reload.
 */
export class TableViewSerializer implements WebviewPanelSerializer {

  /**
   * Registers table view serializer.
   * 
   * @param context Extension context.
   * @returns Disposable object for this webview panel serializer.
   */
  public static register(context: ExtensionContext): Disposable {
    return window.registerWebviewPanelSerializer(ViewTypes.TableView,
      new TableViewSerializer(context.extensionUri));
  }

  /**
   * Creates new Table webview serializer.
   * 
   * @param extensionUri Extension directory Uri.
   */
  constructor(private extensionUri: Uri) {
  }

  /**
   * Restores webview panel on vscode reload for table views.
   * 
   * @param webviewPanel Webview panel to restore.
   * @param state Saved web view panel state.
   */
  async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any) {
    const documentUri: Uri = Uri.parse(state.documentUrl);
    console.log('tabular.data.viewer:deserializeWeviewPanel(): documentUrl:', documentUri.toString());
    TableView.render(this.extensionUri, documentUri, webviewPanel);
  }
}

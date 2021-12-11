import {
  WebviewPanel,
  WebviewPanelSerializer,
  Uri,
} from 'vscode';

import { TableView } from './tableView';

/**
 * Table webview panel serializer for restoring table views on vscode reload.
 */
export class TableViewSerializer implements WebviewPanelSerializer {

  /**
   * Creates new webview serializer.
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

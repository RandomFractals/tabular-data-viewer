
import {
  Disposable,
  ViewColumn,
  WebviewOptions,
  WebviewPanel,
  WebviewPanelOptions,
  Uri,
  window,
  Webview
} from 'vscode';

import { getUri } from '../utils/fileUtils';

export class TableView {
  public static currentView: TableView | undefined;
  private readonly _webviewPanel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(webviewPanel: WebviewPanel, extensionUri: Uri) {
    this._webviewPanel = webviewPanel;
    this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);
    this._webviewPanel.webview.html = this.getWebviewContent(this._webviewPanel.webview, extensionUri);
  }

  public static render(extensionUri: Uri) {
    if (TableView.currentView) {
      TableView.currentView._webviewPanel.reveal(ViewColumn.Active);
    }
    else {
      const webviewPanel = window.createWebviewPanel('tableView', 'Table View', {
          viewColumn: ViewColumn.Active,
          preserveFocus: true
        }, { // weview panel options
          enableScripts: true,
          enableCommandUris: true
        }
      );
      TableView.currentView = new TableView(webviewPanel, extensionUri);
    }
  }

  public dispose() {
    TableView.currentView = undefined;
    this._webviewPanel.dispose();
    while (this._disposables.length) {
      const disposable: Disposable | undefined = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private getWebviewContent(webview: Webview, extensionUri: Uri) {
    const toolkitUri: Uri = getUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js',
    ]);

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="module" src="${toolkitUri}"></script>
          <title>Table View</title>
        </head>
        <body>
          <h1>Hello World!</h1>
          <vscode-button id="test-button">Hi!</vscode-button>
        </body>
      </html>
    `;
  }
}
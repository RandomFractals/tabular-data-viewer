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

import * as path from 'path';

import { getUri } from '../utils/fileUtils';

/**
 * Defines Table view class for managing state and behaviour of Table webview panels.
 */
export class TableView {
  public static currentView: TableView | undefined;
  private readonly _webviewPanel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * Creates new TableView instance for the initial table data rendering.
   * 
   * @param webviewPanel Reference to the webview panel
   * @param extensionUri Extension directory Uri
   */
  private constructor(webviewPanel: WebviewPanel, extensionUri: Uri) {
    this._webviewPanel = webviewPanel;

    // dispose table view resources when table view panel is closed by the user or via vscode apis
    this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

    // set table view html content for the webview panel
    this._webviewPanel.webview.html = this.getWebviewContent(this._webviewPanel.webview, extensionUri);

    // add webview messaging and commands handler
    this.addWebviewMessageListener(this._webviewPanel.webview);
  }

  /**
   * Reveals current table view or creates new table webview panel for table data display.
   * 
   * @param extensionUri Extension directory Uri
   */
  public static render(extensionUri: Uri) {
    if (TableView.currentView) {
      // show current table webview panel
      TableView.currentView._webviewPanel.reveal(ViewColumn.Active);
    }
    else {
      const webviewPanel = window.createWebviewPanel(
        'tabular.data.tableView', // webview panel view type
        'Table View', // webview panel title
        {
          viewColumn: ViewColumn.Active, // use active view column for display
          preserveFocus: true
        }, 
        { // weview panel options
          enableScripts: true, // enable JavaScript in webview
          enableCommandUris: true // ???
        }
      );

      // set custom table view panel icon
      webviewPanel.iconPath = Uri.file(path.join(extensionUri.fsPath, './resources/icons/tabular-data-viewer.svg'));

      // set as current table view for now
      TableView.currentView = new TableView(webviewPanel, extensionUri);
    }
  }

  /**
   * Disposes table view resources when webview panel is closed.
   */
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

  /**
   * Creates webview html content for the webview panel display.
   * 
   * @param webview Reference to the extensions webview
   * @param extensionUri Extension directory Uri
   * @returns Html string for the webview content
   */
  private getWebviewContent(webview: Webview, extensionUri: Uri): string {
    const webviewUiToolkitUri: Uri = getUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js',
    ]);

    const tableViewUri: Uri = getUri(webview, extensionUri, ['web', 'scripts', 'tableView.js']);

    // Tip: Install the es6-string-html VS Code extension 
    // to enable html code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="module" src="${webviewUiToolkitUri}"></script>
          <script type="module" src="${tableViewUri}"></script>
          <title>Table View</title>
        </head>
        <body>
          <h1>Hello World!</h1>
          <vscode-button id="test-button">Hi!</vscode-button>
        </body>
      </html>
    `;
  }

  /**
  * Adds webivew messaging support and executes commands
  * based on the message command received.
  *
  * @param webview Reference to the extension webview
  */
  private addWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage((message: any) => {
        const command: string = message.command;
        const text = message.text;
        switch (command) {
          case 'hello':
            window.showInformationMessage(text);
            break;
        }
      }, 
      undefined, // args
      this._disposables
    );
  }
}

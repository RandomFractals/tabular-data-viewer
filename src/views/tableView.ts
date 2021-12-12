import {
  Disposable,
  ViewColumn,
  WebviewOptions,
  WebviewPanel,
  WebviewPanelOptions,
  WebviewPanelOnDidChangeViewStateEvent,
  WebviewPanelSerializer,
  Uri,
  window,
  Webview
} from 'vscode';

import * as path from 'path';
import * as fileUtils from '../utils/fileUtils';

import { ViewTypes } from './viewTypes';

/**
 * Defines Table view class for managing state and behaviour of Table webview panels.
 */
export class TableView {
  public static currentView: TableView | undefined;
  private static _views: Map<string, TableView> = new Map<string, TableView>();

  private readonly _webviewPanel: WebviewPanel;
  private readonly _extensionUri: Uri;
  private readonly _documentUri: Uri;
  private readonly _viewUri: Uri;
  private readonly _fileName: string;
  private _disposables: Disposable[] = [];

  /**
   * Creates new TableView instance for tabular data rendering.
   * 
   * @param webviewPanel Reference to the webview panel.
   * @param extensionUri Extension directory Uri.
   * @param documentUri Data document Uri.
   */
  private constructor(webviewPanel: WebviewPanel, extensionUri: Uri, documentUri: Uri) {
    this._webviewPanel = webviewPanel;
    this._extensionUri = extensionUri;
    this._documentUri = documentUri;

    // create custom table view Uri
    this._viewUri = documentUri.with({ scheme: 'tabular-data' });

    // extract data file name from the data source document path
    this._fileName = fileUtils.getFileName(documentUri);

    // dispose table view resources when table view panel is closed by the user or via vscode apis
    this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

    // configure webview panel
    this.configure();

    // add it to the tracked table webviews
    TableView._views.set(this._viewUri.toString(), this);
  }

  /**
   * Reveals current table view or creates new table webview panel for table data display.
   * 
   * @param extensionUri Extension directory Uri.
   * @param documentUri Data document Uri.
   */
  public static render(extensionUri: Uri, documentUri: Uri, webviewPanel?: WebviewPanel) {
    const viewUri: Uri = documentUri.with({ scheme: 'tabular-data' });
    const tableView: TableView | undefined = TableView._views.get(viewUri.toString());
    if (tableView) {
      // show loaded table webview panel
      tableView.webviewPanel.reveal(ViewColumn.Active);
      TableView.currentView = tableView;
    }
    else {
      if (!webviewPanel) {
        // create new webview panel for the table view
        webviewPanel = TableView.createWebviewPanel(documentUri);

        // set custom table view panel icon
        webviewPanel.iconPath = Uri.file(path.join(extensionUri.fsPath, './resources/icons/tabular-data-viewer.svg'));
      }

      // set as current table view
      TableView.currentView = new TableView(webviewPanel, extensionUri, documentUri);
    }
  }

  /**
   * Creates new webview panel for the given data source document Uri.
   * 
   * @param documentUri Data source document Uri.
   * @returns New webview panel instance.
   */
  private static createWebviewPanel(documentUri: Uri): WebviewPanel {
    // create new webview panel for the table view
    return window.createWebviewPanel(
      ViewTypes.TableView, // webview panel view type
      fileUtils.getFileName(documentUri), // webview panel title
      {
        viewColumn: ViewColumn.Active, // use active view column for display
        preserveFocus: true
      },
      { // weview panel options
        enableScripts: true, // enable JavaScript in webview
        enableCommandUris: true,
        enableFindWidget: true,
        retainContextWhenHidden: true
      }
    );
  }

  /**
   * Disposes table view resources when webview panel is closed.
   */
  public dispose() {
    TableView.currentView = undefined;
    TableView._views.delete(this._viewUri.toString());
    this._webviewPanel.dispose();
    while (this._disposables.length) {
      const disposable: Disposable | undefined = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Configures webview html for view display.
   */
  public configure(): void {
    // set table view html content for the webview panel
    this.webviewPanel.webview.html = this.getWebviewContent(this.webviewPanel.webview, this._extensionUri);

    // process webview messages
    this.webviewPanel.webview.onDidReceiveMessage((message: any) => {
      const command: string = message.command;
      const text = message.text;
      switch (command) {
        case 'hello':
          window.showInformationMessage(text);
          break;
        case 'refresh':
          // relad data view and config
          this.refresh();
      }
    }, undefined, this._disposables);
  }

  /**
   * Reloads tablue view on data save chances or vscode IDE realod.
   */
  public async refresh(): Promise<void> {
    // update webview
    this.webviewPanel.webview.postMessage({
      command: 'refresh',
      fileName: this._fileName,
      documentUrl: this._documentUri.toString()
    });
  }

  /**
   * Gets the underlying webview panel instance for this view.
   */
  get webviewPanel(): WebviewPanel {
    return this._webviewPanel;
  }

  /**
   * Gets view panel visibility status.
   */
  get visible(): boolean {
    return this._webviewPanel.visible;
  }


  /**
   * Gets the source data uri for this view.
   */
  get documentUri(): Uri {
    return this._documentUri;
  }

  /**
   * Gets the view uri to load on tabular data view command triggers or vscode IDE reload. 
   */
  get viewUri(): Uri {
    return this._viewUri;
  }

  /**
   * Creates webview html content for the webview panel display.
   * 
   * @param webview Reference to the extensions webview.
   * @param extensionUri Extension directory Uri.
   * @returns Html string for the webview content.
   */
  private getWebviewContent(webview: Webview, extensionUri: Uri): string {
    const webviewUiToolkitUri: Uri = fileUtils.getWebviewUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js',
    ]);

    const tableViewUri: Uri = fileUtils.getWebviewUri(webview, extensionUri, ['web', 'scripts', 'tableView.js']);

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
}

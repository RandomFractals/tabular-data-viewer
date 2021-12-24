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
  Webview,
  workspace
} from 'vscode';

import * as path from 'path';
import { TextDecoder } from 'util';

import * as fileUtils from '../utils/fileUtils';
import { ViewTypes } from './viewTypes';

const d3 = require('d3-dsv');

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
  private readonly _fileExtension: string;
  private _disposables: Disposable[] = [];

  /**
   * Reveals current table view or creates new table webview panel for tabular data display.
   * 
   * @param extensionUri Extension directory Uri.
   * @param documentUri Data document Uri.
   * @param webviewPanel Optional webview panel instance.
   */
  public static render(extensionUri: Uri, documentUri: Uri, webviewPanel?: WebviewPanel) {
    const viewUri: Uri = documentUri.with({ scheme: 'tabular-data' });
    console.log('tabular.data.view:render(): loading table view:', viewUri.toString());
    console.log('\tdocumentUri:', documentUri);
    const tableView: TableView | undefined = TableView._views.get(viewUri.toString());
    if (tableView) {
      // show loaded table webview panel in the active editor view column
      const viewColumn: ViewColumn = ViewColumn.Active ? ViewColumn.Active : ViewColumn.One;
      tableView.webviewPanel.reveal(viewColumn);
      TableView.currentView = tableView;
    }
    else {
      if (!webviewPanel) {
        // create new webview panel for the table view
        webviewPanel = TableView.createWebviewPanel(documentUri);
      }
      else {
        // enable scripts for existing webview panel from table editor
        webviewPanel.webview.options = {
          enableScripts: true,
          enableCommandUris: true
        };
      }

      // set custom table view panel icon
      webviewPanel.iconPath = Uri.file(path.join(extensionUri.fsPath, './resources/icons/tabular-data-viewer.svg'));

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
      { // webview panel options
        enableScripts: true, // enable JavaScript in webview
        enableCommandUris: true,
        enableFindWidget: true,
        retainContextWhenHidden: true
      }
    );
  }

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
    this._fileExtension = path.extname(this._fileName);

    // dispose table view resources when table view panel is closed by the user or via vscode apis
    this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);

    // configure webview panel
    this.configure();

    // add it to the tracked table webviews
    TableView._views.set(this._viewUri.toString(), this);
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
        case 'refresh':
          // relad data view and config
          this.refresh();
      }
    }, undefined, this._disposables);
  }

  /**
   * Reloads table view on data save changes or vscode IDE realod.
   */
  public async refresh(): Promise<void> {
    // load data
    workspace.fs.readFile(this._documentUri).then((binaryData: Uint8Array) => {
      const textData: string = new TextDecoder().decode(binaryData);
      this.logTextData(textData);

      // parse dsv data for now
      const dsvParser = d3.dsvFormat(this.delimiter);
      let tableData: any = dsvParser.parse(textData, d3.autoType);
      this.logTableData(tableData);

      // update webview
      this.webviewPanel.webview.postMessage({
        command: 'refresh',
        fileName: this._fileName,
        documentUrl: this._documentUri.toString(),
        tableData: tableData
      });      
    }, reason => {
      window.showErrorMessage(`Could not load \`${this._documentUri}\` content. Reason: \n ${reason}`);
    });
  }

  /**
   * Logs truncated text data for debug.
   * 
   * @param textData Text data to log.
   * @param maxChars Max characters to log.
   */
  private logTextData(textData: string, maxChars: number = 1000): void {
    const contentLength: number = textData.length;
    console.log('tabular.data.view:data:\n',
      textData.substring(0, contentLength > maxChars ? maxChars : contentLength), ' ...');
  }

  /**
   * Logs parsed table data for debug.
   * 
   * @param tableData Parsed table data.
   */
  private logTableData(tableData: any): void {
    console.log('tabular.data.view:rowCount:', tableData.length);
    console.log('columns:', tableData.columns);
    console.log('1st 10 rows:', tableData.slice(0, 10));
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
   * Gets data file delimiter based on file extension.
   */
  get delimiter(): string {
    let delimiter: string = '';
    switch (this._fileExtension) {
      case '.csv':
        delimiter = ',';
        break;
      case '.tsv':
      case '.tab':
        delimiter = '\t';
        break;
    }
    return delimiter;
  }

  /**
   * Creates webview html content for the webview panel display.
   * 
   * @param webview Reference to the extensions webview.
   * @param extensionUri Extension directory Uri.
   * @returns Html string for the webview content.
   */
  private getWebviewContent(webview: Webview, extensionUri: Uri): string {
    // create webview UI toolkitUri
    const webviewUiToolkitUri: Uri = fileUtils.getWebviewUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js',
    ]);

    // create table view script and styles Uris
    const tableViewScriptUri: Uri = fileUtils.getWebviewUri(webview, extensionUri, ['web', 'scripts', 'tableView.js']);
    const tableViewStylesUri: Uri = fileUtils.getWebviewUri(webview, extensionUri, ['web', 'styles', 'table-view.css']);

    // get CSP (Content-Security-Policy) source link for this webview
    const cspSource: string = this.webviewPanel.webview.cspSource;

    // Tip: Install the es6-string-html VS Code extension 
    // to enable html code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" 
            content="default-src 'self' ${cspSource} https://*;
              script-src ${cspSource} https: 'unsafe-inline' 'unsafe-eval';
              style-src ${cspSource} https: 'unsafe-inline';
              img-src ${cspSource} 'self' https://* blob: data:;
              font-src 'self' ${cspSource} https://* blob: data:;
              connect-src 'self' https://* wss://*;
              worker-src 'self' https://* blob: data:">
          <link href="https://unpkg.com/tabulator-tables@5.0.8/dist/css/tabulator.min.css" rel="stylesheet">
          <link href="${tableViewStylesUri}" rel="stylesheet">
          <script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.0.8/dist/js/tabulator.min.js"></script>
          <script type="module" src="${webviewUiToolkitUri}"></script>
          <script type="module" src="${tableViewScriptUri}"></script>
          <title>Table View</title>
        </head>
        <body>
          <div id="toolbar">
            <div id="toolbar-left">
              <vscode-progress-ring id="progress-ring"></vscode-progress-ring>
            </div>
            <div id="toolbar-right">
              <vscode-button id="refresh-button"
                appearance="icon" aria-label="Refresh">
	              <span class="codicon codicon-refresh">↺</span>
              </vscode-button>
            </div>
          </div>
          <div id="table-container" />
        </body>
      </html>
    `;
  }
}

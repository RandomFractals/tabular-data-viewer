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
  workspace,
  commands
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';

import * as fileUtils from '../utils/fileUtils';
import { FileTypes } from './fileTypes';
import { ViewTypes } from './viewTypes';
import { Stream } from 'stream';

// eslint-disable-next-line @typescript-eslint/naming-convention
const {Table} = require('tableschema');

/**
 * Defines Table view class for managing state and behaviour of Table webview panels.
 */
export class TableView {
  // table view tracking vars
  public static currentView: TableView | undefined;
  private static _views: Map<string, TableView> = new Map<string, TableView>();

  // table view instance vars
  private readonly _webviewPanel: WebviewPanel;
  private readonly _extensionUri: Uri;
  private readonly _documentUri: Uri;
  private readonly _viewUri: Uri;
  private readonly _fileName: string;
  private readonly _fileExtension: string;
  private _disposables: Disposable[] = [];

  // tabular data vars
  private _tableSchema: any;
  private _tableData: Array<any> = [];
  private _currentDataPage: number = 0;
  private _totalRows: number = 0;

  // TODO: move the settings below to tabular data viewer config options later
  // default page data size for incremental data loading into table view
  private readonly _pageDataSize: number = 1000;

  // infer table schema rows sample size limit
  private readonly _inferDataSize = 100;

  /**
   * Reveals current table view or creates new table webview panel for tabular data display.
   * 
   * @param extensionUri Extension directory Uri.
   * @param documentUri Data document Uri.
   * @param webviewPanel Optional webview panel instance.
   */
  public static render(extensionUri: Uri, documentUri: Uri, webviewPanel?: WebviewPanel) {
    // create table view Uri
    const viewUri: Uri = documentUri.with({ scheme: 'tabular-data' });
    console.log('tabular.data.view:render(): loading table view:', viewUri.toString(true)); // skip encoding
    // console.log('\tdocumentUri:', documentUri);

    // check for open table view
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
      ViewTypes.tableView, // webview panel view type
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
      switch (command) {
        case 'refresh':
          // reload data view and config
          this.refresh();
          break;
        case 'addData':
          this.addData(message.dataPage);
          break;
        case 'saveData':
          this.saveData(message.data, message.dataFileName, message.dataFileType);
          break;
      }
    }, undefined, this._disposables);
  }

  /**
   * Reloads table view on data save changes or vscode IDE realod.
   */
  public async refresh(): Promise<void> {
    // clear loaded data info
    this._totalRows = 0;
    this._currentDataPage = 0;
    this._tableData.length = 0;

    // load tabular data file
    const table = await Table.load(this._documentUri.fsPath);

    // infer table shema
    this._tableSchema = await table.infer(this._inferDataSize);
    console.log('tabular.data.view:tableInfo:', this._tableSchema);

    // open data stream and read tabular row data
    const dataStream = await table.iter({stream: true, keyed: true});
    const tableRows: Array<any> = [];
    let rowCount: number = 0;
    dataStream.on('data', (row: any) => {
      tableRows.push(row);
      rowCount++;
      if (rowCount % this._pageDataSize === 0) {
        // console.log('rows:', rowCount);
      }
      if (rowCount === this._pageDataSize) {
        // send initial set of data rows to table view for display
        this.loadData(tableRows);
      }
    });

    dataStream.on('end', () => {
      this.logTableData(tableRows, table.headers);
      if (tableRows.length < this._pageDataSize) {
        // load first page of data
        this.loadData(tableRows);
      }
    });
  }

  /**
   * Loads initial set of table rows into table view.
   * 
   * @param tableRows Table data rows array.
   */
  public async loadData(tableRows: Array<any>) {
    // save table data for incremental load into table view
    this._tableData = tableRows;
    this._totalRows = this._tableData.length;

    // send initial set of data rows to table view for display
    const initialDataRows: Array<any> = tableRows.slice(0, Math.min(this._pageDataSize, this._totalRows));
    this.webviewPanel.webview.postMessage({
      command: 'refresh',
      fileName: this._fileName,
      documentUrl: this._documentUri.toString(),
      tableShema: this._tableSchema,
      totalRows: this._totalRows,
      tableData: initialDataRows
    });
  }

  /**
   * Sends more data rows to the table view for incremental data loading and display.
   * 
   * @param dataPage Requested data page index for loading the next set of data rows.
   */
  public async addData(dataPage: number): Promise<void> {
    const nextRows: number = dataPage * this._pageDataSize;
    if (nextRows < this._totalRows) {
      // get the next set of data rows to load in table view
      const dataRows: Array<any> =
        this._tableData.slice(nextRows, Math.min(nextRows + this._pageDataSize, this._totalRows));

      // send the next set of data rows to display
      this.webviewPanel.webview.postMessage({
        command: 'addData',
        dataRows: dataRows,
        totalRows: this._totalRows
      });
    }
  }

  /**
   * Saves table data in a new data file.
   */
  public async saveData(data: any, dataFileName: string, dataFileType: string): Promise<void> {
    console.log('tableView:saveData(): saving data:', dataFileName);
    // this.logTextData(data);

    // create full data file path for saving data
    let dataFilePath: string = path.dirname(this._documentUri.fsPath);
    dataFilePath = path.join(dataFilePath, dataFileName);

    // display save file dialog
    const dataFileUri: Uri | undefined = await window.showSaveDialog({
      defaultUri: Uri.parse(dataFilePath).with({ scheme: 'file' })
    });

    if (dataFileUri) {
      // save data
      // TODO: switch to using workspace.fs for data save
      // workspace.fs.writeFile(dataFileUri, data); 
      fs.writeFile(dataFileUri.fsPath, data, (error) => {
        if (error) {
          window.showErrorMessage(`Unable to save data file: '${dataFileUri.fsPath}'. \n\t Error: ${error.message}`);
        }
        else {
          // show saved data file
          commands.executeCommand('vscode.open', dataFileUri);
        }
      });
    }
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
  private logTableData(tableData: any, columns?: []): void {
    console.log('tabular.data.view:rowCount:', tableData.length);
    if (columns) {
      console.log('\tcolumns:', columns );
    }
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
      case FileTypes.csv:
        delimiter = ',';
        break;
      case FileTypes.tsv:
      case FileTypes.tab:
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
    // create webview UI toolkit Uri
    const webviewUiToolkitUri: Uri =
      fileUtils.getWebviewUri(webview, extensionUri, ['web', 'scripts', 'toolkit.min.js']);

    // create table view script and styles Uris
    const tableViewScriptUri: Uri =
      fileUtils.getWebviewUri(webview, extensionUri, ['web', 'scripts', 'tableView.js']);
    const tableViewStylesUri: Uri =
      fileUtils.getWebviewUri(webview, extensionUri, ['web', 'styles', 'table-view.css']);

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
          <link href="https://unpkg.com/tabulator-tables@5.0.10/dist/css/tabulator.min.css" rel="stylesheet">
          <link href="${tableViewStylesUri}" rel="stylesheet">
          <script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.0.10/dist/js/tabulator.min.js"></script>
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
              <vscode-button id="reload-button"
                appearance="icon" aria-label="Reload Data">
	              <span class="codicon codicon-refresh">↺</span>
              </vscode-button>
              <vscode-button id="scroll-to-last-row-button"
                appearance="icon" aria-label="Scroll to Last Row">
	              <span class="codicon codicon-arrow-down">⤓</span>
              </vscode-button>
              <vscode-button id="scroll-to-first-row-button"
                appearance="icon" aria-label="Scroll to First Row">
	              <span class="codicon codicon-arrow-up">⤒</span>
              </vscode-button>
              <select id="save-file-type-selector" title="Save Data">
                <option value="">📥&nbsp;Save</option>
                <option value="csv">,,, csv</option>
                <option value="ssv">;;; csv</option>
                <option value="tsv">⇥ tsv</option>
                <option value="json">{} &nbsp;json</option>
                <option value="html">&lt;/&gt; &nbsp;html</option>
              </select>
            </div>
          </div>
          <div id="table-container" />
        </body>
      </html>
    `;
  }
}

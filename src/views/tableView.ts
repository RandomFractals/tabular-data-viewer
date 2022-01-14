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
import { Stream } from 'stream';

import * as config from '../configuration/configuration';
import * as fileUtils from '../utils/fileUtils';

import { FileInfo } from './fileInfo';
import { FileTypes } from './fileTypes';
import { ViewTypes } from './viewTypes';
import { DataViewTypes } from './dataViewTypes';
import { statusBar } from './statusBar';

import { ViewCommands } from '../commands/viewCommands';
import { Settings } from '../configuration/Settings';

// eslint-disable-next-line @typescript-eslint/naming-convention
const {Table} = require('tableschema');

// eslint-disable-next-line @typescript-eslint/naming-convention
const Papa = require('papaparse');

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
  private _fileInfo: FileInfo;
  private _disposables: Disposable[] = [];

  // tabular data vars
  private _tableSchema: any;
  private _tableData: Array<any> = [];
  private _totalRows: number = 0;
  private _loadTime: number = 0; // load time in milliseconds
  private _loadedDataPage: number = 0;
  private _tableConfig: any = {};


  // TODO: move the settings below to tabular data viewer config options later
  // infer table schema rows sample size limit
  private readonly _inferDataSize = 100;

  /**
   * Reveals current table view or creates new table webview panel for tabular data display.
   * 
   * @param extensionUri Extension directory Uri.
   * @param documentUri Data document Uri.
   * @param webviewPanel Optional webview panel instance.
   * @param tableConfig Table view config to restore.
   */
  public static render(extensionUri: Uri, documentUri: Uri, 
    webviewPanel?: WebviewPanel, tableConfig?: any) {
    // create table view Uri
    const viewUri: Uri = documentUri.with({ scheme: 'tabular-data' });
    console.log('tabular.data.view:render(): loading table view:', viewUri.toString(true)); // skip encoding
    // console.log('\tdocumentUri:', documentUri);

    // check for open table view
    const tableView: TableView | undefined = TableView._views.get(viewUri.toString(true)); // skip encoding
    if (tableView) {
      // show loaded table webview panel in the active editor view column
      tableView.reveal();
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
      webviewPanel.iconPath = Uri.file(
        path.join(extensionUri.fsPath, './resources/icons/tabular-data-viewer.svg'));

      // set as current table view
      TableView.currentView = new TableView(webviewPanel, extensionUri, documentUri, tableConfig);
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
   * @param tableConfig Optional table view config to restore.
   */
  private constructor(webviewPanel: WebviewPanel, extensionUri: Uri,
    documentUri: Uri, tableConfig?: any) {

    // save webview panel and extension uri
    this._webviewPanel = webviewPanel;
    this._extensionUri = extensionUri;

    if (tableConfig) {
      // save table view config to restore
      this._tableConfig = tableConfig;
    }

    // create new file info for the data source
    this._fileInfo = new FileInfo(documentUri);
    statusBar.showFileStats(this._fileInfo);

    // configure webview panel
    this.configure();

    // add it to the tracked table webviews
    TableView._views.set(this.viewUri.toString(true), this);

    // dispose table view resources when table view panel is closed by the user or via vscode apis
    this._webviewPanel.onDidDispose(this.dispose, this, this._disposables);
  }

  /**
   * Disposes table view resources when webview panel is closed.
   */
  public dispose() {
    console.log('tabular.data.view:dispose(): disposing table view:', this.fileInfo.fileName);
    TableView.currentView = undefined;
    TableView._views.delete(this.viewUri.toString(true)); // skip encoding
    while (this._disposables.length) {
      const disposable: Disposable | undefined = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
    
    // clear and hide current table view stats display
    statusBar.hide();
  }

  /**
   * Reveals loaded table view and sets it as active editor in vscode editor panel.
   * Updates tabular data file stats, columns, and total rows display in vscode status bar.
   */
  public reveal() {
    const viewColumn: ViewColumn = ViewColumn.Active ? ViewColumn.Active : ViewColumn.One;
    this.webviewPanel.reveal(viewColumn);

    // update status bar with active table view stats
    statusBar.showFileStats(this._fileInfo);
    if (this._tableSchema) {
      statusBar.showColumns(this._tableSchema.fields);
    }
    statusBar.totalRows = this._totalRows;
    statusBar.loadTime = this._loadTime;
  }

  /**
   * Configures webview html for tabular data view display,
   * and adds webview message request handlers for data updates.
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
        case 'updateTableConfig':
          this.updateTableConfig(message.tableConfig);
          break;
        case 'openTableConfig':
          commands.executeCommand(ViewCommands.vscodeOpen,
            Uri.parse(this._fileInfo.fileUri.toString(true) + '.table.json'));
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
    this._loadedDataPage = 0;
    this._tableData.length = 0;
    this._loadTime = 0;

    // load tabular data file
    const table = await Table.load(this._fileInfo.filePath);
    statusBar.showFileStats(this._fileInfo);

    // infer table shema
    this._tableSchema = await table.infer(this._inferDataSize);
    console.log('tabular.data.view:tableSchema: columns:', this._tableSchema.fields);
    statusBar.showColumns(this._tableSchema.fields);
    this.saveTableSchema(this._tableSchema);

    // create table in table view before loading data
    /*
    this.webviewPanel.webview.postMessage({
      command: 'createTable',
      tableConfig: this._tableConfig,
      tableSchema: this._tableSchema
    }); */

    // create readable CSV data file stream
    const startReadTime: Date = new Date();
    const dataFileStream: fs.ReadStream =
      fs.createReadStream(this._fileInfo.filePath, 'utf-8');

    // pipe data file reads to Papa parse for CSV data parsing in a worker thread
    const dataStream: Stream = dataFileStream.pipe(
      Papa.parse(Papa.NODE_STREAM_INPUT, {
        header: true, // key results by header fields
        dynamicTyping: this.dynamicDataTyping, // enable dynamic typing
        skipEmptyLines: true, // ignore empty lines to avoid errors
        worker: true, // parse data lines in a worker thread
      }));
    
    // process parsed data rows
    const tableRows: Array<any> = [];
    let rowCount: number = 0;
    dataStream.on('data', (row: any) => {
      tableRows.push(row);
      rowCount++;
      if ((rowCount % (this.dataPageSize * 10)) === 0) {
        console.log(`tabular.data.view:refresh(): parsing rows ${rowCount.toLocaleString()}+ ...`);
        if (this.visible) {
          statusBar.showMessage(`Parsing rows ${rowCount.toLocaleString()}+`);
        }
      }

      if (rowCount === this.dataPageSize) {
        // send initial set of data rows to table view for display
        this.loadData(tableRows);
        // TODO: add pause/resume stream later
      }
    });

    dataStream.on('end', () => {
      // calculate and save data load time in seconds
      const endReadTime: Date = new Date();
      this._loadTime = (endReadTime.getTime() - startReadTime.getTime());
      statusBar.loadTime = this._loadTime;
      this.logTableData(tableRows); //, table.headers);

      // udpate table view state
      this._tableData = tableRows;
      this._totalRows = this._tableData.length;

      if (this.visible) {
        // update total rows display in status bar
        statusBar.totalRows = tableRows.length;
      }

      if (tableRows.length < this.dataPageSize) {
        // load first page of data
        this.loadData(tableRows);
        // clear data loading status bar message
        statusBar.showMessage('');
      }
      else if (tableRows.length > this.dataPageSize) {
        // load remaining table rows
        const dataPageIndex: number = 1;
        this.addData(dataPageIndex);
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
    this.logTableData(tableRows);

    if (this.visible) {
      statusBar.showMessage(`Loading data`);
    }

    if (!this._tableConfig.columns) { // no initial table config
      // load previously saved table config
      this._tableConfig = this.loadTableConfig(this._fileInfo.tableConfigFilePath);
    }

    // send initial set of data rows to table view for display
    const nextRows: number = Math.min(this.dataPageSize, this._totalRows);
    const initialDataRows: Array<any> = tableRows.slice(0, nextRows);
    this.webviewPanel.webview.postMessage({
      command: 'refresh',
      fileName: this._fileInfo.fileName,
      documentUrl: this._fileInfo.fileUri.toString(),
      tableConfig: this._tableConfig,
      tableSchema: this._tableSchema,
      totalRows: this._totalRows,
      tableData: initialDataRows,
      dataPageSize: this.dataPageSize
    });
  }

  /**
   * Sends more data rows to the table view for incremental data loading and display.
   * 
   * @param dataPage Requested data page index for loading the next set of data rows.
   */
  public async addData(dataPage: number): Promise<void> {
    let nextRows: number = dataPage * this.dataPageSize;
    if (this._loadedDataPage <= dataPage && nextRows < this._totalRows) {
      // console.log(`tabular.data.view:addData(): loading rows ${nextRows.toLocaleString()}+ ...`);
      if (this.visible) {
        statusBar.showMessage(`Loading rows ${nextRows.toLocaleString()}+`);
      }

      // get the next set of data rows to load in table view
      const dataRows: Array<any> =
        this._tableData.slice(nextRows, Math.min(nextRows + this.dataPageSize, this._totalRows));

      // increment next rows for data loading status update
      nextRows += dataRows.length;
      this._loadedDataPage++;

      // send the next set of data rows to display
      this.webviewPanel.webview.postMessage({
        command: 'addData',
        dataRows: dataRows,
        dataPage: this._loadedDataPage,
        totalRows: this._totalRows
      });
    }

    if (nextRows >= this._totalRows) {
      // clear data loading status bar message
      statusBar.showMessage('');
    }
  }

  /**
   * Saves table data in a new data file.
   */
  public async saveData(data: any, dataFileName: string, dataFileType: string): Promise<void> {
    console.log('tableView:saveData(): saving data:', dataFileName);
    // this.logTextData(data);

    // create full data file path for saving data
    let dataFilePath: string = path.dirname(this._fileInfo.filePath);
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
   * Saves tabular data *.schema.json configuration file
   * on initial data load or table view refresh
   * to enable viewing inferred tabular data columns and types.
   * 
   * @see https://github.com/frictionlessdata/tableschema-js#working-with-schema
   * 
   * @param tableSchema Table schema object to save.
  */
  private async saveTableSchema(tableSchema: any): Promise<void> {
    if (tableSchema && this.createTableSchemaConfig) {
      // save updated table schema from tableschema infer call
      fileUtils.createJsonFile(this._fileInfo.tableSchemaFilePath, tableSchema);
    }
  }

  /**
   * Updates table config and the corresponding *.table.json
   * for the loaded data file on table view columns, sort and filter changes.
   * 
   * @param tableConfig Table config object to save.
   */
  private async updateTableConfig(tableConfig: any): Promise<void> {
    if (tableConfig) {
      this._tableConfig = tableConfig;
      if (this.createTableViewConfig) {
        // save updated table config for restoring table view after tab close
        fileUtils.createJsonFile(this._fileInfo.tableConfigFilePath, tableConfig);
      }
    }
  }

  /**
   * Loads saved table config.
   * 
   * @param configFilePath Table config file path
   */
  private loadTableConfig(configFilePath: string): any {
    let tableConfig: any = {};
    if (fs.existsSync(configFilePath)) {
      // load and parse previously saved table config
      tableConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    }
    return tableConfig;
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
    console.log('tabular.data.view:loadedRows:', tableData.length.toLocaleString());
    if (columns) {
      console.log('\tcolumns:', columns );
      console.log('1st 10 rows:', tableData.slice(0, 10));
    }
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
    return this._fileInfo.fileUri;
  }

  /**
   * Gets the view uri to load on tabular data view command triggers or vscode IDE reload. 
   */
  get viewUri(): Uri {
    return this._fileInfo.viewUri;
  }

  /**
   * Gets data file info with document uri, table view uri, etc.
   */
  get fileInfo(): FileInfo {
    return this._fileInfo;
  }

  /**
   * Gets data table schema with array of fields for the table columns, etc.
   */
  get tableSchema(): any {
    return this._tableSchema;
  }

  /**
   * Gets loaded data rows count.
   */
  get totalRows(): number {
    return this._totalRows;
  }

  /**
   * Gets data file delimiter based on file extension.
   */
  get delimiter(): string {
    let delimiter: string = '';
    switch (this._fileInfo.fileExtension) {
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
   * Gets default data view type configuration setting.
   */
  get dataViewType(): string {
    return <string>config.get(Settings.dataViewType);
  }

  /**
   * Gets data page size configuration setting.
   */
  get dataPageSize(): number {
    return <number>config.get(Settings.dataPageSize);
  }

  /**
   * Gets dynamic data typing configuration setting for CSV data parsing.
   */
  get dynamicDataTyping(): boolean {
    return <boolean>config.get(Settings.dynamicDataTyping);
  }

  /**
   * Gets create table schema configuration setting for CSV data parsing.
   */
  get createTableSchemaConfig(): boolean {
    return <boolean>config.get(Settings.createTableSchemaConfig);
  }

  /**
   * Gets create table schema configuration setting for CSV data parsing.
   */
  get createTableViewConfig(): boolean {
    return <boolean>config.get(Settings.createTableViewConfig);
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
              <select id="table-page-selector" title="View Data Page">
                <option value="">Page</option>
                <option value="1">1</option>
              </select>
              <select id="save-file-type-selector" title="Save Data">
                <option value="">📥&nbsp;Save</option>
                <option value="csv">,,, csv</option>
                <option value="ssv">;;; csv</option>
                <option value="tsv">⇥ tsv</option>
                <option value="json">{} &nbsp;json</option>
                <option value="html">&lt;/&gt; &nbsp;html</option>
              </select>
              <vscode-button id="view-table-config-button"
                appearance="icon" aria-label="View Table Config">
	              <span class="codicon codicon-gear">⚙</span>
              </vscode-button>
            </div>
          </div>
          <div id="table-container" />
        </body>
      </html>
    `;
  }
}

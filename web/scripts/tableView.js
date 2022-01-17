/* eslint-disable @typescript-eslint/naming-convention */

// initialize vscode api
const vscode = acquireVsCodeApi();

// data document vars
let documentUrl = '';
let fileName = '';
let saveDataFileName = '';

// table view elements
let tableContainer, table, progressRing, saveFileTypeSelector, tablePageSelector;
const toolbarHeight = 40; // table view toolbar height offset

// table view vars
let tableConfig = {};
let tableSchema;
let tableColumns = [];
let tableData = [];
let loadedRows = 0;
let totalRows = 0;
let loadedDataPage = 0;
let dataPageSize = 100000;
let viewState = {
  tableConfig: tableConfig
};

// add page load handler
window.addEventListener('load', initializeView);

// add data/config update handler
window.addEventListener('message', event => {
  switch (event.data.command) {
    case 'createTable':
      table = createTable(event.data.tableSchema);
      break;
    case 'refresh':
      updateViewState(event.data);
      loadData(tableData, tableSchema);
      break;
    case 'addData':
      totalRows = event.data.totalRows;
      addData(table, event.data.dataRows, event.data.dataPage);
      break;
  }
});

/**
 * Initializes table webview.
 */
function initializeView() {
  // initialize table container
  tableContainer = document.getElementById('table-container');
  // console.log('tableView.height:', window.innerHeight);

  // data progress loading indicator
  progressRing = document.getElementById('progress-ring');

  // reload data UI
  const reloadButton = document.getElementById('reload-button');
  reloadButton.addEventListener('click', reloadData);

  // scroll to rows UI
  const scrollToFirstRowButton = document.getElementById('scroll-to-first-row-button');
  scrollToFirstRowButton.addEventListener('click', scrollToFirstRow);

  const scrollToLastRowButton = document.getElementById('scroll-to-last-row-button');
  scrollToLastRowButton.addEventListener('click', scrollToLastRow);

  // table page selector
  tablePageSelector = document.getElementById('table-page-selector');
  tablePageSelector.onchange = showDataPage;

  // save file selector
  saveFileTypeSelector = document.getElementById('save-file-type-selector');
  saveFileTypeSelector.onchange = saveData;

  // restore previous table view state
  viewState = vscode.getState();
  if (viewState && viewState.tableConfig) {
    // get last table view config
    tableConfig = viewState.tableConfig;
  }
  else {
    // create new empty table view config
    viewState = {};
    viewState.tableConfig = tableConfig;
    vscode.setState(viewState);
  }

  // view table config UI
  const viewTableConfigButton = document.getElementById('view-table-config-button');
  viewTableConfigButton.addEventListener('click', openTableConfig);

  // request initial rows data load
  vscode.postMessage({ command: 'refresh' });
}

/**
 * Updates table view state on initial data load and refresh.
 * 
 * @param {*} tableInfo Table data and config info from webview.
 */
function updateViewState(tableInfo) {
  documentUrl = tableInfo.documentUrl;
  fileName = tableInfo.fileName;
  tableSchema = tableInfo.tableSchema;
  tableData = tableInfo.tableData;
  totalRows = tableInfo.totalRows;
  dataPageSize = tableInfo.dataPageSize;

  if (tableInfo.tableConfig.columns) {
    // update table config
    tableConfig = tableInfo.tableConfig;
    viewState.tableConfig = tableConfig;
  }
  viewState.documentUrl = documentUrl;

  // save updated view state
  vscode.setState(viewState);
}

/**
 * Reloads table view data.
 * 
 * @see https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
 */
function reloadData() {
  console.log('tableView.reloadData(): reloading table data ...');
  clearTable(table);
  progressRing.style.visibility = 'visible';
  vscode.postMessage({
    command: 'refresh',
  });
}

/**
 * Opens *.table.json view config in vscode editor.
 */
function openTableConfig() {
  vscode.postMessage({
    command: 'openTableConfig',
  });
}

/**
 * Loads and displays table data.
 * 
 * @param {*} tableData Data array to display in tabulator table.
 * @param {*} tableSchema Data table schema with inferred column fields info.
 */
function loadData(tableData, tableSchema) {
  console.log('tableView.loadData(): loading table data ...');
  logTableData(tableData);
  if (table === undefined) {
    // create table and load initial set of data rows
    table = createTable(tableSchema, tableData);
  }
  else {
    // add new data rows to existing tabulator table
    addData(table, tableData, 1); // next dataPageIndex
    progressRing.style.visibility = 'hidden';
  }
}

/**
 * Requests more data rows to load and display.
 */
function getNextDataPage() {
  const nextDataPage = loadedDataPage + 1;
  if (loadedRows < totalRows && (nextDataPage * dataPageSize) < totalRows) {
    progressRing.style.visibility = 'visible';
    vscode.postMessage({
      command: 'addData',
      dataPage: nextDataPage
    });
  }
  else {
    // hide data loading progress ring
    progressRing.style.visibility = 'hidden';
  }
}

/**
 * Download data handler.
 * 
 * @param {*} fileContents Unencoded contents of the file to save.
 * @param {*} blob Download data blob object.
 * @returns Data blob to save or false to skip download via typical browser api.
 */
function downloadData(fileContents, blob) {
	// console.log(fileContents);
	// request data file save
	vscode.postMessage({
		command: 'saveData',
		data: fileContents,
		dataFileType: saveFileTypeSelector.value,
		dataFileName: saveDataFileName
	});

	// Note: this must return a blob to proceed with the download in a browser,
	// or false to abort download and handle it in table view extension with workspace.fs
	return false; // blob; 
}

/**
 * Logs table data for debug.
 * 
 * @param tableData Loaded able data.
 */
function logTableData(tableData) {
  console.log('tableView.loadedRows:', tableData.length.toLocaleString());
  // console.log('1st 10 rows:', tableData.slice(0, 10));
}

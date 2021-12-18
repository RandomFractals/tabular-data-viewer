/* eslint-disable @typescript-eslint/naming-convention */

// initialize vscode api
const vscode = acquireVsCodeApi();

// table view vars
let table;
let tableColumns = [];
let tableData = [];

// add page load handler
window.addEventListener('load', initializeView);

// add data/config update handler
window.addEventListener('message', event => {
  switch (event.data.command) {
    case 'refresh':
      console.log('refreshing table view ...');
      vscode.setState({ documentUrl: event.data.documentUrl });
      tableData = event.data.tableData;
      loadData(tableData);
      break;
  }
});

/**
 * Initializes table webview.
 */
function initializeView() {
  // notify webview
  vscode.postMessage({ command: 'refresh' });

  // wire refresh button for testing
  const refreshButton = document.getElementById('refresh-button');
  refreshButton.addEventListener('click', onRefresh);
}

/**
 * Reloads webview data.
 * 
 * @see https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
 */
function onRefresh() {
  vscode.postMessage({
    command: 'refresh',
  });
}

/**
 * Loads and displays table data.
 * 
 * @param {*} tableData Data array to display in tabulator columns and rows.
 */
function loadData(tableData) {
  logTableData(tableData);
  if (table === undefined) {
    table = new Tabulator('#tabulator-table', {
      height: '100%',
      autoColumns: true,
      layout: 'fitColumns',
      reactiveData: true,
      data: tableData
    });
  }
  else {
    // reload table data
    clearTable(table);
    addData(table, tableData);
  }
}

/**
 * Removes all table data.
 */
function clearTable(table) {
  if (table) {
    table.clearData();  
  }
}

/**
 * Adds data to the table.
 * 
 * @param {*} table Tabulator table instance.
 * @param {*} tableData Data array for the table rows.
 */
function addData(table, tableData) {
  if (table && tableData) {
    table.addData(tableData, true)
      .then(function (rows) { //rows - array of the row components for the rows updated or added
      })
      .catch(function (error) {
        // handle error updating data
        console.error(error);
      });
  }
}

/**
 * Logs table data for debug.
 * 
 * @param tableData Loaded able data.
 */
function logTableData(tableData) {
  console.log('tabular.data.view:rowCount:', tableData.length);
  console.log('1st 10 rows:', tableData.slice(0, 10));
}

/* eslint-disable @typescript-eslint/naming-convention */

// initialize vscode api
const vscode = acquireVsCodeApi();

// data document vars
let documentUrl = '';
let fileName = '';
let saveDataFileName = '';

// table view vars
let tableContainer, table, progressRing, saveFileTypeSelector;
let tableSchema;
let tableColumns = [];
let tableData = [];
let loadedRows = 0;
let totalRows = 0;
let dataPage = 0;

// table view settings
const toolbarHeight = 40; // table view toolbar height offset
const autoResize = true;
const autoColumns = true;
const enableClipboard = true; // enable clipboard copy and paste
const clipboardPasteAction = 'replace';
const movableColumns = true;
const movableRows = true;
const selectableRows =  true;
const reactiveData = true;
const renderVerticalBuffer = 300; // virtual view buffer height in px for redraw on scroll

// tabulator debug options
const debugInvalidOptions = true; // tabulator warnings

// Note: set these to true to log all events dispatched by the tabulator
const debugEventsExternal = ['tableBuilding', 'dataLoaded', 'tableBuilt'];
const debugEventsInternal = false; // log all internal tabulator events

// table row context menu options
const rowContextMenu = [
  {
    label: "Freeze Row",
    action: function (e, row) {
      row.freeze();
    }
  },
  {
    label: 'Delete Row',
    action: function (e, row) {
      row.delete();
    }
  },
];

const columnHeaderMenu = [
  {
    label: 'Hide Column',
    action: function (e, column) {
      column.hide();
    }
  },
  {
    label: "Freeze Column",
    action: function (e, column) {
      column.updateDefinition({ frozen: true });
    }
  },
  {
    label: 'Delete Column',
    action: function (e, column) {
      column.delete();
    }
  }
];

// add page load handler
window.addEventListener('load', initializeView);

// redraw table on window resize
window.addEventListener('resize', function () {
  // console.log('tableView.height:', window.innerHeight);
  if (table) {
    table.setHeight(window.innerHeight - toolbarHeight);
  }
});

// add data/config update handler
window.addEventListener('message', event => {
  switch (event.data.command) {
    case 'refresh':
      console.log('refreshing table view ...');
      documentUrl = event.data.documentUrl;
      fileName = event.data.fileName;
      vscode.setState({ documentUrl: documentUrl });
      tableSchema = event.data.tableSchema;
      tableData = event.data.tableData;
      totalRows = event.data.totalRows;
      loadData(tableData, fileName);
      break;
    case 'addData':
      totalRows = event.data.totalRows;
      addData(table, event.data.dataRows);
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

  // save file selector
  saveFileTypeSelector = document.getElementById('save-file-type-selector');
  saveFileTypeSelector.onchange = saveData;

  // reload data UI
  const reloadButton = document.getElementById('reload-button');
  reloadButton.addEventListener('click', reloadData);

  // scroll to rows UI
  const scrollToFirstRowButton = document.getElementById('scroll-to-first-row-button');
  scrollToFirstRowButton.addEventListener('click', scrollToFirstRow);

  const scrollToLastRowButton = document.getElementById('scroll-to-last-row-button');
  scrollToLastRowButton.addEventListener('click', scrollToLastRow);

  // request initial rows data load
  vscode.postMessage({ command: 'refresh' });
}

/**
 * Reloads table view data.
 * 
 * @see https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
 */
function reloadData() {
  clearTable(table);
  progressRing.style.visibility = 'visible';
  vscode.postMessage({
    command: 'refresh',
  });
}

/**
 * Loads and displays table data.
 * 
 * @param {*} tableData Data array to display in tabulator table.
 */
function loadData(tableData) {
  logTableData(tableData);
  if (table === undefined) {
    // create table and load initial set of data rows
    createTable(tableData);
  }
  else {
    // add new data rows to existing tabulator table
    addData(table, tableData);
    progressRing.style.visibility = 'hidden';
  }
}

/**
 * Creates new Tabulator table with initial set of data to display.
 * 
 * @param {*} tableData Data array to display in tabulator table.
 */
function createTable(tableData) {
  if (table === undefined) {
    table = new Tabulator('#table-container', {
      height: window.innerHeight - toolbarHeight,
      maxHeight: '100%',
      autoResize: autoResize,
      autoColumns: autoColumns,
      columnDefaults: {
        headerMenu: columnHeaderMenu
      },
      clipboard: enableClipboard, // enable clipboard copy and paste
      clipboardPasteAction: clipboardPasteAction,
      layout: 'fitDataStretch', // 'fitColumns',
      layoutColumnsOnNewData: true,
      movableColumns: movableColumns,
      movableRows: movableRows,
      selectable: selectableRows,
      reactiveData: reactiveData,
      data: tableData,
      rowContextMenu: rowContextMenu,
      renderVerticalBuffer: renderVerticalBuffer,
      debugInvalidOptions: debugInvalidOptions, // log invalid tabulator config warnings
      debugEventsExternal: debugEventsExternal,
      debugEventsInternal: debugEventsInternal,
      persistenceMode: 'local',
      persistenceID: fileName,
      // persistentLayout: true,
      persistence: {
        sort: true,
        filter: true,
        group: true,
        columns: true,
      },
      // add table setting save/restore handlers
      persistenceWriterFunc: (id, type, data) => saveTableSetting(id, type, data),
      persistenceReaderFunc: (id, type) => restoreTableSetting(id, type),
      // add table data download handler
      downloadReady: (fileContents, blob) => downloadData(fileContents, blob)
    });

    // update table settings after initial data rows load
    table.on('tableBuilt', onTableBuilt);
  }
}

/**
 * Updates Tabulator table after initial set of data rows is loaded.
 */
function onTableBuilt () {
  // hide data loading progress ring
  progressRing.style.visibility = 'hidden';

  // get table columns for debug
  const columns = table.getColumns();
  console.log('tableView.columns:', columns);

  // add row selection column
  // TODO: make this optional via tabular data viewer config setting
  table.addColumn({
    formatter: 'rowSelection',
    titleFormatter: 'rowSelection',
    headerMenu: [], // don't show header context menu
    headerSort: false,
    download: false // don't include it in data save
  }, true) // add as 1st column
    .then(function (column) { // column - row selection colulmn component
    })
    .catch(function (error) {
      // log adding row selection column error for now
      console.error('tableView.addRowSelectionCollumn: Error\n', error);
    });

  // request more data for incremental data loading
  loadedRows = table.getRows().length;
  if (loadedRows < totalRows) {
    dataPage++;
    progressRing.style.visibility = 'visible';
    vscode.postMessage({
      command: 'addData',
      dataPage: dataPage
    });
  }
}

/**
 * Saves updated table setting/config for table view reload and restore later.
 * 
 * @param {*} id Table config persistence id.
 * @param {*} type Type of table setting to save: sort, filter, group, page or columns.
 * @param {*} data Array or object of data for the table options config save.
 */
function saveTableSetting(id, type, data) {
  // create table setting key
  const tableSettingKey = `${id}-${type}`;
  console.log(`tableSetting:${tableSettingKey}:`, data);

  // save table settings in local storage for now
  localStorage.setItem(tableSettingKey, JSON.stringify(data));
}

/**
 * Restores table setting on table view reload.
 * 
 * @param {*} id Table config persistence id.
 * @param {*} type Type of table setting to restore: sort, filter, group, page or columns.
 * @returns 
 */
function restoreTableSetting(id, type) {
  // create table setting key
  const tableSettingKey = `${id}-${type}`;

  // try to get requested table setting from local storage
  const tableSetting = localStorage.getItem(tableSettingKey);
  if (tableSetting) {
    console.log(`tableSetting:${tableSettingKey}:`, tableSetting);
  }
  return tableSetting ? JSON.parse(tableSetting) : false;
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
 * Clears displayed table data.
 */
function clearTable(table) {
  if (table) {
    // clear displayed table view
    table.clearData();

    // reset loaded table data row/page counters
    loadedRows = 0;
    totalRows = 0;
    dataPage = 0;
  }
}

/**
 * Adds data rows to the table.
 * 
 * @param {*} table Tabulator table instance.
 * @param {*} dataRows Data array for the table rows to add.
 */
function addData(table, dataRows) {
  if (table && dataRows) {
    table.addData(dataRows, true)
      .then(function (rows) { // rows - array of the row components for the rows updated or added
        // update loaded table data array and rows counter
        tableData.push(dataRows.shift());
        loadedRows += rows.length;
        if (loadedRows < totalRows) {
          // request more data rows to load and display
          dataPage++;
          progressRing.style.visibility = 'visible';
          vscode.postMessage({
            command: 'addData',
            dataPage: dataPage
          });
        }
        else {
          // hide data loading progress ring
          progressRing.style.visibility = 'hidden';
          console.log('tableView:rowCount:', loadedRows, 'totalRows:', totalRows);
        }
      })
      .catch(function (error) {
        // handle error updating data
        console.error(error);
      });
  }
}

/**
 * Scrolls table data display to the first table row.
 */
function scrollToFirstRow() {
  const rows = table.getRows();
  table.scrollToRow(rows[0], 'top', true);
}

/**
 * Scrolls table data display to the last table row.
 */
function scrollToLastRow() {
  const rows = table.getRows();
  table.scrollToRow(rows[rows.length-1], 'top', true);
}

/**
 * Saves table data as CSV, TSV, or JSON data array document.
 */
function saveData() {
  // get requested data file format
  let dataFileType = saveFileTypeSelector.value;

  // construct save data file name
  const dataFileName = fileName.substring(0, fileName.lastIndexOf('.') + 1);
  saveDataFileName = dataFileName + dataFileType;
  console.log('tabView:saveData(): saving data:', saveDataFileName);

  // adjust text data delimiter and file type
  let delimiter = ',';
  switch (dataFileType) {
    case 'ssv': // semicolon delimited CSV
      delimiter = ';';
      dataFileType = 'csv';
      saveDataFileName = `${dataFileName}.csv`;
      break;
    case 'tsv':
      delimiter = '\t';
      dataFileType = 'csv'; // download file type
      break;
  }

  // use Tabulator download data API for now to generate data blob to save
  switch (dataFileType) {
    case 'csv':
    case 'tsv':
      table.download(dataFileType, saveDataFileName, { delimiter: delimiter });
      break;    
    case 'json':
      table.download(dataFileType, saveDataFileName);
      break;
    case 'html':
      table.download(dataFileType, saveDataFileName, { style: true });
      break;
  }
}

/**
 * Logs table data for debug.
 * 
 * @param tableData Loaded able data.
 */
function logTableData(tableData) {
  console.log('tableView:rowCount:', tableData.length);
  console.log('1st 10 rows:', tableData.slice(0, 10));
}

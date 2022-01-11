/* eslint-disable @typescript-eslint/naming-convention */

// initialize vscode api
const vscode = acquireVsCodeApi();

// data document vars
let documentUrl = '';
let fileName = '';
let saveDataFileName = '';

// table view elements
let tableContainer, table, progressRing, saveFileTypeSelector, tablePageSelector;

// table view vars
let tableConfig = {};
let tableSchema;
let tableColumns = [];
let tableData = [];
let loadedRows = 0;
let totalRows = 0;
let loadedDataPage = 0;
let viewState = {
  tableConfig: tableConfig
};

// table view settings
const toolbarHeight = 40; // table view toolbar height offset
const autoResize = true;
let autoColumns = true;
const enableClipboard = true; // enable clipboard copy and paste
const clipboardPasteAction = 'replace';
const movableColumns = true;
const movableRows = true;
const selectableRows =  true;

const pagination = false;
const paginationSize = 1000;
const pageDataSize = 100000;
const pageSizes = [100, 1000, 10000, 100000];

const reactiveData = false;
const renderVerticalBuffer = 300; // virtual view buffer height in px for redraw on scroll

// tabulator debug options
const debugInvalidOptions = true; // tabulator warnings

// Note: set these events to true to log all events dispatched by the Tabulator table.
// To debug table data loading add 'dataLoaded' to the tracked external Tabulator events.
const debugEventsExternal = false; //['tableBuilding', 'tableBuilt'];
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
    case 'createTable':
      createTable(event.data.tableSchema);
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
 * Creates new Tabulator table with initial set of data to display.
 * 
 * @param {*} tableSchema Data table schema with inferred column fields info.
 * @param {*} tableData Data array to display in tabulator table.
 */
function createTable(tableSchema, tableData) {
  if (table === undefined) {
    // show progress ring
    progressRing.style.visibility = 'visible';

    // create table columns array from table schema fields
    tableColumns = createTableColumns(tableSchema);
    if (tableColumns.length > 0) {
      // don't auto generate columns
      autoColumns = false;
    }
    
    // create tabulator table instance for tabular data display
    const tableOptions = createTableConfig(tableColumns);
    table = new Tabulator('#table-container', tableOptions);

    // update table settings after initial data rows load
    table.on('tableBuilt', onTableBuilt);

    // log loaded table data counts for debug
    table.on('dataLoaded', data => {
      console.log('tableView.table.dataLoaded():loadedData:', data.length.toLocaleString());
    });
  }
  return table;
}

/**
 * Creates table column descriptors from frictionless data table schema config.
 * 
 * @see https://specs.frictionlessdata.io/table-schema/#descriptor
 * 
 * @param {*} tableSchema Frictionless data table schema config.
 */
function createTableColumns(tableSchema) {

  if (viewState.tableConfig.columns) {
    // use columns from restored table view config
    return viewState.tableConfig.columns;
  }

  const tableColumns = [];
  // Note: sometimes table rows are not parsed correctly
  // by the frictionless table schema infer() and returns only 1 field
  if (tableSchema && tableSchema.fields && tableSchema.fields.length > 1) {
    // console.log('tableView.createTableColumns():tableSchema:', tableSchema.fields);
    tableSchema.fields.forEach(field => {
      // determine field sorter type
      let sorter = 'string';
      switch (field.type) {
        case 'integer':
        case 'number':
          sorter = 'number';
          break;
        // TODO: add more sorter types for dates, etc.
      }

      // add new table column descriptor
      tableColumns.push({
        field: field.name,
        title: field.name,
        resizable: true,
        headerSort: true,
        sorter: sorter
      });
    });
    console.log('tableView.createTableColumns():columns:', tableColumns);
  }
  return tableColumns;
}

/**
 * Creates Tabulator table config.
 * 
 * @param {*} tableColumns Optional table column descriptors array.
 */
function createTableConfig(tableColumns) {
  let tableConfig = {
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
    pagination: pagination,
    paginationSize: paginationSize,
    paginationSizeSelector: pageSizes,
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
  };

  if (tableColumns && tableColumns.length > 0) {
    // use restored table columns config
    tableConfig.autoColumns = false;
    tableConfig.columns = tableColumns;
  }

  const initialSort = viewState.tableConfig.sort;
  if (initialSort) {
    // set initial sort from restored table view state
    tableConfig.initialSort = initialSort;
  }

  return tableConfig;
}

/**
 * Updates Tabulator table after initial set of data rows is loaded.
 */
function onTableBuilt () {
  // hide data loading progress ring
  progressRing.style.visibility = 'hidden';

  // get table columns for debug
  const columns = table.getColumns();
  // console.log('tableView.onTableBuilt():columns:', columns);

  if (tableColumns.length > 0 && tableColumns[0].formatter !== 'rowSelection') {
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
  }

  // request more data for incremental data loading
  loadedRows = table.getRows().length;
  console.log('tableView.loadedRows:', loadedRows.toLocaleString());
  getNextDataPage();
}

/**
 * Requests more data rows to load and display.
 */
function getNextDataPage() {
  const nextDataPage = loadedDataPage + 1;
  if (loadedRows < totalRows && (nextDataPage * pageDataSize) < totalRows) {
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
 * Adds data rows to the table view and requests the next data page.
 * 
 * @param {*} table Tabulator table instance.
 * @param {*} dataRows Data array for the table rows to add.
 * @param {*} dataPageIndex Data page index for the data rows to add.
 */
function addData(table, dataRows, dataPageIndex) {
  if (dataPageIndex > loadedDataPage) {
    // increment last loaded data page index
    loadedDataPage++;

    // update data page selector
    tablePageSelector.innerHTML += `<option value="${loadedDataPage}">${loadedDataPage + 1}</option>`;

    // add new rows to table data
    tableData.push(...dataRows);
    if (loadedRows <= 0) {
      // reset table data on on reload
      table.replaceData(dataRows);
    }
    loadedRows += dataRows.length;
    // console.log('tableView.addData(): loading data page:', loadedDataPage);
    // console.log('tableView.loadedRows:', loadedRows.toLocaleString(), 'totalRows:', totalRows.toLocaleString());
  }

  // request more data rows to load and display
  getNextDataPage();
}

/**
 * Loads requested data page in table view.
 */
function showDataPage() {
  let dataPageIndex = Number(tablePageSelector.value);
  // console.log('tableView.showDataPage(): loading data page:', dataPageIndex);
  const pageStart = (dataPageIndex * pageDataSize);
  const pageData = tableData.slice(pageStart, Math.min(pageStart + pageDataSize, totalRows));
  table.clearData();
  table.replaceData(pageData);
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
    loadedDataPage = 0;
    tableData = [];

    // clear UI controls
    tablePageSelector.innerHTML = '<option value="">Page</option><option value="1">1</option>';
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
  // console.log(`tableView.saveTableSetting(): ${tableSettingKey}=`, data);

  // save table setting in local storage
  localStorage.setItem(tableSettingKey, JSON.stringify(data));

  if (viewState.tableConfig === undefined) {
    // add table config to table view state
    viewState.tableConfig = tableConfig;
  }

  // update table config in view state
  tableConfig[type] = data;
  vscode.setState(viewState);
  // console.log(`tableView.saveTableSetting():viewState`, viewState);

  // notify webview about table config changes
  vscode.postMessage({
    command: 'updateTableConfig',
    tableConfig: tableConfig
  });
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
    console.log(`tableView.restoreTableSetting(): ${tableSettingKey}=`, tableSetting);
  }
  return tableSetting ? JSON.parse(tableSetting) : false;
}

/**
 * Scrolls table data display to the first table row.
 */
function scrollToFirstRow() {
  const rows = table.getRows('active'); // rows with applied sort and filter
  table.scrollToRow(rows[0], 'top', true);
}

/**
 * Scrolls table data display to the last table row.
 */
function scrollToLastRow() {
  const rows = table.getRows('active'); // rows with applied sort and filter
  table.scrollToRow(rows[rows.length-1], 'top', true);
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
  console.log('tableView.loadedRows:', tableData.length.toLocaleString());
  // console.log('1st 10 rows:', tableData.slice(0, 10));
}

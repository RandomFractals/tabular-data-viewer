// TODO: convert this to JS module later
// import perspective from 'https://unpkg.com/@finos/perspective@1.1.0/dist/cdn/perspective.js';

// perspective viewer vars
let viewer, worker, view, theme;
let rowCounter,
	dataUrl, dataFileName,
	toggleConfig = true,
	restoringConfig = true,
	dataTable = '',
	dataViews = {},
	tableNames = [],
	viewConfig = {},
	viewData = [],
	logLevel = 'debug';

window.addEventListener('load', async function () {
	// create worker for table data loading
	worker = perspective.worker();
});

document.addEventListener('DOMContentLoaded', async function () {
	// initialize table container
	tableContainer = document.getElementById('table-container');

	// add perspective viewer element
	viewer = document.createElement('perspective-viewer');
	viewer.setAttribute('editable', true);
	tableContainer.appendChild(viewer);

	// add viewer config change handler for saving view state
	viewer.addEventListener('perspective-config-update', onConfigUpdate);
});

/**
 * Perspective view config update handler.
 */
async function onConfigUpdate() {
	// get perspective viewer config
	const viewConfig = await viewer.save();
	console.log('perspective.onConfigUpdate():', JSON.stringify(viewConfig, null, 2));
	if (!restoringConfig) {
		updateConfig();
	}
	// updateStats();

	if (viewState.tableConfig === undefined) {
		// add table config to table view state
		viewState.tableConfig = tableConfig;
	}

	if (!tableConfig.views) {
		// create new views config collection
		tableConfig.views = {};
	}

	// update perspective view config in table view state
	const viewType = viewConfig.plugin;
	tableConfig.view = viewType;
	tableConfig.views[viewType] = viewConfig;

	// update table view state
	vscode.setState(viewState);
	console.log(`perspective.onConfigUpdate():viewState`, viewState);

	// notify webview about table config changes
	vscode.postMessage({
		command: 'updateTableConfig',
		tableConfig: tableConfig
	});

	// hide data loading progress ring
	progressRing.style.visibility = 'hidden';
}

/**
 * Creates new Tabulator table with initial set of data to display.
 * 
 * @param {*} tableSchema Data table schema with inferred column fields info.
 * @param {*} tableData Data array to display in tabulator table.
 */
async function createTable(tableSchema, tableData) {
	if (table === undefined) {
		// show progress ring
		progressRing.style.visibility = 'visible';

		// create perspective table and load initial data into view
		table = await worker.table(tableData);
		viewer.load(table);
		viewer.toggleConfig();

		// create table columns array from table schema fields 
		/*
		tableColumns = createTableColumns(tableSchema);
		if (tableColumns.length > 0) {
			// don't auto generate columns
			autoColumns = false;
		}
		*/
		// create tabulator table instance for tabular data display
		// const tableOptions = createTableConfig(tableColumns);

		// TODO: modify this to work with Perspective viewer grid

		// update table settings after initial data rows load
		// table.on('tableBuilt', onTableBuilt);

		// log loaded table data counts for debug
		/* table.on('dataLoaded', data => {
			console.log('tableView.table.dataLoaded():loadedData:', data.length.toLocaleString());
		}); */
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
	// TODO: create Perspective view grid config
	let tableConfig = {};

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
function onTableBuilt() {
	// hide data loading progress ring
	progressRing.style.visibility = 'hidden';

	// TODO: modify this to work with Perspective viewer
	// get table columns for debug
	//const columns = table.getColumns();
	// console.log('tableView.onTableBuilt():columns:', columns);

	if (tableColumns.length > 0 && tableColumns[0].formatter !== 'rowSelection') {
		// add row selection column
		// TODO: make this optional via tabular data viewer config setting
		// TODO: modify this to work with Perspective viewer
		/*
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
			}); */
	}

	// TODO: modify this to work with Perspective viewer
	// request more data for incremental data loading
	// loadedRows = table.getRows().length;
	console.log('tableView.loadedRows:', loadedRows.toLocaleString());
	getNextDataPage();
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
			table.replace(dataRows);
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
	const pageStart = (dataPageIndex * dataPageSize);
	const pageData = tableData.slice(pageStart, Math.min(pageStart + dataPageSize, totalRows));
	// TODO: modify this to work with Perspective viewer
	table.clear();
	// table.replace(pageData);
	table.update(pageData);
}

/**
 * Clears displayed table data.
 */
function clearTable(table) {
	if (table) {
		// clear displayed table view
		table.clear();

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
	// TODO: modify this to work with Perspective viewer

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
	// TODO: modify this to work with Perspective viewer

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
	// TODO
}

/**
 * Scrolls table data display to the last table row.
 */
function scrollToLastRow() {
	// TODO
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

	// TODO: use Perspective table API to generate data blob to save
	switch (dataFileType) {
		case 'csv':
		case 'tsv':
			// table.download(dataFileType, saveDataFileName, { delimiter: delimiter });
			break;
		case 'json':
			// table.download(dataFileType, saveDataFileName);
			break;
		case 'html':
			// table.download(dataFileType, saveDataFileName, { style: true });
			break;
	}
}

/**
 * Restores data view config on new data view load or new view config load.
 * 
 * @param viewConfig Data view config to restore.
 */
function restoreConfig(viewConfig) {
	// set updating view config flag
	restoringConfig = true;

	// restore view config
	logMessage(`restoreConfig(\n${JSON.stringify(viewConfig, null, 2)})`);
	viewer.restore(viewConfig);
	//updateStats();

	// clear updating view config flag
	restoringConfig = false;
}

/**
 * Updates view config caused by user interactions or new config load.
 */
function updateConfig() {
	// get latest view config state from data viewer
	const viewerConfig = viewer.save();

	// strip out updating, render time and style properties for clean view config compare and save
	deleteProperty('updating', viewerConfig);
	deleteProperty('render_time', viewerConfig);
	deleteProperty('style', viewerConfig);
	deleteProperty('class', viewerConfig);
	// logMessage(`viewer.perspective-config-update\n${logConfig(viewConfig)}\n${logConfig(viewerConfig)}`);

	// update view config state and create config change log
	let configChangeLog = '';
	Object.keys(viewerConfig).forEach(propertyName => {
		if (viewConfig[propertyName] === undefined ||
			viewConfig[propertyName] !== viewerConfig[propertyName]) {
			viewConfig[propertyName] = viewerConfig[propertyName];
			configChangeLog += `\n ${propertyName}: ${viewConfig[propertyName]}`;
		}
	});

	if (configChangeLog.length > 0) {
		logMessage(`viewer.perspective-config-update \n${configChangeLog}`);
		// save updated view config state for vscode data view panel reload
		vscode.setState({
			uri: dataUrl,
			table: dataTable,
			config: viewConfig,
			theme: theme,
			views: dataViews
		});
		// notify data preview
		vscode.postMessage({
			command: 'config',
			table: dataTable,
			config: viewConfig
		});
	}
} // end of updateConfig()

/**
 * Deletes object property.
 * @param propertyName Property name to delete.
 */
function deleteProperty(propertyName, obj) {
	if (obj.hasOwnProperty(propertyName)) {
		delete obj[propertyName];
	}
}

/**
 * Updates data stats on view config changes or data load/update.
 */
function updateStats() {
	const numberOfRows = viewer.view ? viewer.view.num_rows() : viewer.table.size();
	// get rows count and displayed columns info
	numberOfRows.then(rowCount => {
		let columns = viewer['columns'];
		/*if (viewConfig.hasOwnProperty('columns')) {
			// use view config columns property instead
			columns = viewConfig['columns'].split('\",\"');
		}*/

		// notify webview for data stats status update
		/* TODO: see if we need to post this to update columns and row count in status bar
		vscode.postMessage({
			command: 'stats',
			columns: columns,
			rowCount: rowCount
		});*/

		logMessage(`updateStats()\n\n columns: ${columns}\n rows: ${rowCount.toLocaleString()}`);
	});
}

/**
 * Converts data view config to string for console log display.
 * @param dataViewConfig Data view config object or string.
 */
function logConfig(dataViewConfig) {
	return (typeof dataViewConfig === 'string') ? dataViewConfig : JSON.stringify(dataViewConfig, null, 2);
}

/**
 * Logs new data.view message to console for more info or debug.
 * 
 * @param message Log message text.
 * @param logLevel Optional log level type.
 */
function logMessage(message, logLevel = 'debug') {
	const category = 'data.view:';
	switch (logLevel) {
		case 'warn':
			console.warn(category + message);
			break;
		case 'info':
			console.info(category + message);
			break;
		case 'error':
			console.error(category + message);
			break;
		default: // debug
			console.log(category + message);
			break;
	}
}

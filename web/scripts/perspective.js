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
	currentView ='Datagrid'; // default

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
	viewer.setAttribute('settings', true);
	tableContainer.appendChild(viewer);

	// add viewer config change handler for saving view state
	viewer.addEventListener('perspective-config-update', onConfigUpdate);
});

/**
 * Adds supported data format save options
 * to the tabular data view toolbar Save dropdown.
 * 
 * @param {*} saveFileTypeSelector Save dropdown UI component.
 */
function addSaveOptions(saveFileTypeSelector) {
	// add save JSON and arrow data options
	saveFileTypeSelector.innerHTML += `
    <option value="json">{} &nbsp;json</option>
    <option value="arrow">⋙ arrow</option>`;
}

/**
 * Perspective view config update handler.
 */
async function onConfigUpdate() {
	// get perspective viewer config
	const viewConfig = await viewer.save();
	// console.log('perspective.onConfigUpdate():', JSON.stringify(viewConfig, null, 2));

	if (viewState.tableConfig === undefined) {
		// add table config to table view state
		viewState.tableConfig = tableConfig;
	}

	if (!tableConfig.views) {
		// create new views config collection
		tableConfig.views = {};
	}

	// check perspective view type and last saved view config
	const viewType = viewConfig.plugin;
	const lastViewConfig = viewState.tableConfig.views[viewType];
	if (currentView !== viewType && lastViewConfig !== undefined) {
		// restore previously saved view config
		currentView = viewType;
		await viewer.restore(lastViewConfig);
	}
	else {
		// update current view config
		tableConfig.view = viewType;
		tableConfig.views[viewType] = viewConfig;

		// update table view state
		vscode.setState(viewState);
		// console.log(`perspective.onConfigUpdate():viewState`, viewState);

		// notify webview about table config changes
		vscode.postMessage({
			command: 'updateTableConfig',
			tableConfig: tableConfig
		});
	}

	// hide data loading progress ring
	progressRing.style.visibility = 'hidden';
}

/**
 * Creates new Perspective viewer table with initial set of data to display.
 * 
 * @param {*} tableSchema Data table schema with inferred column fields info.
 * @param {*} tableData Data array to display in tabulator table.
 */
async function createTable(tableSchema, tableData) {
	if (table === undefined) {
		// show progress ring
		progressRing.style.visibility = 'visible';

		// initialize perspective viewer columns
		const columns = createTableColumns(tableSchema);
		if (columns.length > 0) {
			const columnNames = columns.map(columnName => `'${columnName}'`);
			viewer.setAttribute('columns', `[${columnNames}]`);
		}

		// create perspective table and load initial data into view
		table = await worker.table(tableData);
		viewer.load(table);

		if (viewState.tableConfig.view !== undefined &&
			viewState.tableConfig.views[viewState.tableConfig.view] !== undefined) {
			// restore prior perspective view config
			currentView = viewState.tableConfig.view;
			await viewer.restore(viewState.tableConfig.views[currentView]);
		}
		else {
			// restore prior tabular data columns config
			await viewer.restore({columns: columns});
			viewer.toggleConfig();
		}
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
	const tableColumns = [];
	if (viewState.tableConfig.columns) {
		// use columns from restored table view config
		viewState.tableConfig.columns.forEach(column => {
			if (column.field !== undefined) {
				tableColumns.push(column.field);
			}
		});
	}
	else if (tableSchema && tableSchema.fields && tableSchema.fields.length > 1) {
		// Note: sometimes table rows are not parsed correctly
		// by the frictionless table schema infer() and returns only 1 field
		// console.log('tableView.createTableColumns():tableSchema:', tableSchema.fields);
		tableSchema.fields.forEach(field => {
			tableColumns.push(field.name);
		});
	}
	console.log('perspective.createTableColumns():columns:', tableColumns);
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
 * Updates perspective view after initial set of data rows is loaded.
 */
function onTableBuilt() {
	// hide data loading progress ring
	progressRing.style.visibility = 'hidden';

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

	// get requested page data
	const pageStart = (dataPageIndex * dataPageSize);
	const pageData = tableData.slice(pageStart, Math.min(pageStart + dataPageSize, totalRows));

	// clear and update perspective table
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
async function saveData() {
	// get requested data file format
	let dataFileType = saveFileTypeSelector.value;

	// construct save data file name
	const dataFileName = fileName.substring(0, fileName.lastIndexOf('.') + 1);
	saveDataFileName = dataFileName + dataFileType;
	console.log('perspective.saveData(): saving data:', saveDataFileName);

	// get current view data
	const view = await viewer.getView();
	let viewData;
	switch (dataFileType) {
		case 'csv':
			viewData = await view.to_csv();
			break;
		case 'json':
			const jsonDataArray = await view.to_json();
			viewData = JSON.stringify(jsonDataArray, null, 2);
			break;
		case 'arrow':
			viewData = await view.to_arrow();
			break;
	}

	// send current view data to webview to save it
	downloadData(viewData);
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

		console.log(`perspective.updateStats():columns: ${columns}\n rows: ${rowCount.toLocaleString()}`);
	});
}

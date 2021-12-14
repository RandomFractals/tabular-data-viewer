/* eslint-disable @typescript-eslint/naming-convention */

// initialize vscode api
const vscode = acquireVsCodeApi();

// add page load handler
window.addEventListener('load', initializeView);

// add data/config update handler
window.addEventListener('message', event => {
  switch (event.data.command) {
    case 'refresh':
      console.log('refreshing table view ...');
      vscode.setState({ documentUrl: event.data.documentUrl });
      // TODO: add table view display with Tabulator
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

  // display some test data in Tabulator for now
  let tableData = [
    { id: 1, name: "Billy Bob", age: "12", gender: "male", height: 1, col: "red", dob: "", cheese: 1 },
    { id: 2, name: "Mary May", age: "1", gender: "female", height: 2, col: "blue", dob: "14/05/1982", cheese: true },
  ];
  let table = new Tabulator('#tabulator-table', {
    data: tableData,
    columns: [
      { title: "Name", field: "name" },
      { title: "Age", field: "age" },
      { title: "Gender", field: "gender" },
      { title: "Height", field: "height" },
      { title: "Favourite Color", field: "col" },
      { title: "Date Of Birth", field: "dob" },
      { title: "Cheese Preference", field: "cheese" },
    ]
  });
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

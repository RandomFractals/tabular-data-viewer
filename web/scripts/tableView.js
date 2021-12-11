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
  const testButton = document.getElementById('test-button');
  testButton.addEventListener('click', onTestClick);
}

/**
 * Handles test button click.
 * 
 * @see https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
 */
function onTestClick() {
  vscode.postMessage({
    command: 'hello',
    text: 'Hey there partner! 🤠'
  });
}

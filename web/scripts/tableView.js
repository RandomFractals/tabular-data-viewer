// initialize vscode api
const vscode = acquireVsCodeApi();

// add page load handler
window.addEventListener('load', initializeView);

/**
 * Initializes table webview.
 */
function initializeView() {
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

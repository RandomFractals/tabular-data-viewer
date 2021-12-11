import { Uri, Webview } from 'vscode';

/**
 * Gets webview Uri for a given file or resource.
 * 
 * @param webview Reference to the extension webview.
 * @param extensionUri Extension directory Uri.
 * @param pathList File or resource path parts.
 * @returns Webview Uri for requested file or resource.
 */
export function getWebviewUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}


/**
 * Gets file name path token from a document Uri.
 * 
 * @param documentUri Document Uri.
 */
export function getFileName(documentUri: Uri): string {
  const pathTokens: Array<string> = documentUri.path.split('/');
  return pathTokens[pathTokens.length - 1]; // last path token
}
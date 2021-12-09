import { Uri, Webview } from 'vscode';

/**
 * Gets webview Uri for a given file or resource.
 *
 * @remarks This Uri can be used within a webview's HTML as a link to the
 * given file or resource.
 *
 * @param webview Reference to the extension webview
 * @param extensionUri Extension directory Uri
 * @param pathList File or resource path parts
 * @returns Webview Uri for requested file or resource
 */
export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

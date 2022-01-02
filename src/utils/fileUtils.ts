import { Uri, Webview } from 'vscode';

import * as fs from 'fs';

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

/**
 * Gets local data file size for status display.
 * 
 * @param filePath File path to get size stats for.
 */
export function getFileSize(filePath: string): number {
	let fileSize: number = -1;
	if (fs.existsSync(filePath)) {
		const stats: fs.Stats = fs.statSync(filePath);
		fileSize = stats.size;
	}
	return fileSize;
}

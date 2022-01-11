import { Uri, Webview, window } from 'vscode';

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

/**
 * Creates JSON data, *.table.json, or *.schema.json
 * data configuration file for tabular data views.
 * 
 * @param filePath JSON data file path.
 * @param data JSON data object to serialize and save.
 */
export function createJsonFile(filePath: string, data: any): void {
	if (data) {
		const jsonString: string = JSON.stringify(data, null, 2);
		try {
			const fileWriteStream: fs.WriteStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
			fileWriteStream.write(jsonString);
			fileWriteStream.end();
		}
		catch (error: any) {
			const errorMessage: string = 
				`Unable to save JSON file: ${filePath}. \nError: ${error.message}`;
			window.showErrorMessage(errorMessage);
		}
	}
}

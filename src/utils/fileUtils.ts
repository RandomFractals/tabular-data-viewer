import { Uri, Webview, window } from 'vscode';

import * as fs from 'fs';

import { FileTypes } from '../views/fileTypes';

/**
 * Supported data formats for the tabular data views
 * as string array of the supported data file extensions.
 */
export const supportedDataFormats: Array<string> = Object.values(FileTypes);

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
 * Converts github data file url to raw github user content url
 * for loading data files from public github repositories.
 * 
 * @param dataFileUrl User frinedly data file url from a github repository.
 * @returns Github content Url to use for loading raw file data.
 */
export function convertToGitHubContentUrl(dataFileUrl: string): string {
	let gitHubContentUrl: string = dataFileUrl;
	if (dataFileUrl.startsWith('https://github.com')) {
		// rewrite github data url to use raw.githubusercontent.com
		gitHubContentUrl = dataFileUrl.replace('https://github.com/', 'https://raw.githubusercontent.com/');

		// strip out blob part
		gitHubContentUrl = gitHubContentUrl.replace('/blob/', '/');
	}
	return gitHubContentUrl;
}

/**
 * Converts github content url to user-friendly github repository url for display
 * and linking to external public data sources hosted on github.
 * 
 * @param dataFileUrl Github content data file url from a github repository.
 * @returns User friendly github data file url for display, linking and copy/paste in a browser.
 */
export function convertToGitHubRepositoryUrl(dataFileUrl: string): string {
	let gitHubContentUrl: string = dataFileUrl;
	if (dataFileUrl.startsWith('https://raw.githubusercontent.com/')) {

		// rewrite github content url to user-friendly github repository url for display
		const gitHubContentUri: Uri = Uri.parse(dataFileUrl);

		// parse github content path tokens
		const contentPathTokens: Array<string> = gitHubContentUri.path.split('/');

		if (contentPathTokens.length > 4) {
			// extract github user, repository, and branch name
			const user: string = contentPathTokens[1];
			const repository: string = contentPathTokens[2];
			const branch: string = contentPathTokens[3];

			// rewrite github content url to github.com url
			gitHubContentUrl = dataFileUrl.replace(`https://raw.githubusercontent.com/${user}/${repository}/${branch}/`,
				`https://github.com/${user}/${repository}/blob/${branch}/`);
		}
	}
	
	return gitHubContentUrl;
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

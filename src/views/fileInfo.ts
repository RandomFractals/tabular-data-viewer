import * as fs from 'fs';
import * as path from 'path';
import { Uri } from 'vscode';
import * as fileUtils from '../utils/fileUtils';
import * as formatUtils from '../utils/formatUtils';

/**
 * Defines file info class for tabular data view.
 */
export class FileInfo {

	private _fileName: string;
	private _fileExtension: string;
	private _fileSize: number = 0;
	private _viewUri: Uri;


	/**
	 * Creates new FileInfo instance for data file Uri.
	 * 
	 * @param fileUri Data file Uri.
	 */
	constructor(public readonly fileUri: Uri) {
		// extract file name and extension from data file Uri
		this._fileName = fileUtils.getFileName(fileUri);
		this._fileExtension = path.extname(this._fileName);

		// create custom table view Uri
		this._viewUri = fileUri.with({ scheme: 'tabular-data' });
	}

	/**
	 * Gets data file path.
	 */
	public get filePath(): string {
		return this.fileUri.fsPath;
	}

	/**
	 * Gets file name from file path.
	 */
	public get fileName(): string {
		return this._fileName;
	}

	/**
	 * Gets file extension.
	 */
	public get fileExtension(): string {
		return this._fileExtension;
	}

	/**
	 * Gets file size in bytes.
	 */
	public get fileSize(): number {
		if (this._fileSize <= 0) {
			this._fileSize = fileUtils.getFileSize(this.fileUri.fsPath);
		}
		return this._fileSize;
	}

	/**
	 * Gets data file view Uri.
	 */
	public get viewUri(): Uri {
		return this._viewUri;
	}
}

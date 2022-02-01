import { Uri } from 'vscode';

import * as path from 'path';

import * as fileUtils from '../utils/fileUtils';

/**
 * Defines file info class for tabular data view.
 */
export class FileInfo {

	private _fileName: string;
	private _fileExtension: string;
	private _fileSize: number = 0;
	private _fileUrl: string;
	private _viewUri: Uri;
	private _isRemote: boolean = false;

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

		// initialize file Url string
		this._fileUrl = fileUri.toString(true); // skip encoding

		// check for remote data file Uri
		if (this._fileUrl.startsWith('https://')) {
			this._isRemote = true;
		}
		else {
			// use fs path for local data file url
			this._fileUrl = this.fileUri.fsPath;
		}
	}

	/**
	 * Gets remote data file flag.
	 */
	public get isRemote(): boolean {
		return this._isRemote;
	}

	/**
	 * Gets full local file fs path or remote data file url.
	 */
	public get fileUrl(): string {
		return this._fileUrl;
	}

	/**
	 * Gets data file path.
	 */
	public get filePath(): string {
		if (this._isRemote) {
			return this.fileUri.path;
		}
		return this.fileUri.fsPath;
	}

	/**
	 * Gets full file name.
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
		if (!this._isRemote && this._fileSize <= 0) {
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

	/**
 	 * Gets table schema file path.
 	 */
	public get tableSchemaFilePath(): string {
		return path.join(path.dirname(this.filePath), `${this._fileName}.schema.json`);
	}

	/**
	 * Gets table view config file path.
 	 */
	public get tableConfigFilePath(): string {
		return path.join(path.dirname(this.filePath), `${this._fileName}.table.json`);
	}
}

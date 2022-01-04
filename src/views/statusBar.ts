import {
	StatusBarAlignment,
	StatusBarItem,
	window
} from 'vscode';

import { FileInfo } from './fileInfo';

import * as formatUtils from '../utils/formatUtils';

/**
 * Defines status bar UI component for data file stats and tabular data loading status display.
 */
export class StatusBar {

	private static _instance: StatusBar;

	private _statusBarItem: StatusBarItem;
	private readonly _statusBarItemName: string = 'tabular.data';

	private _fileInfo: FileInfo | undefined;
	private _fileSizeInfo: string = '';

	private _columns: [] = [];
	private _columnsInfo: string = '';

	private _totalRows: number = 0;
	private _statusMessage: string = '';

	/**
	 * Creates tabular data view status bar UI.
	 */
	private constructor() {
		// create tabular data status bar item
		this._statusBarItem = window.createStatusBarItem(
			this._statusBarItemName,
			StatusBarAlignment.Right,
			100, // align left priority
		);
	}

	/**
	* Gets status bar singleton instance.
	*/
	public static get instance(): StatusBar {
		if (!this._instance) {
			this._instance = new this();
		}
		return this._instance;
	}


	/**
	 * Shows data file stats in vscode status bar.
	 * 
	 * @param fileInfo File info with data document uri, etc.
	 */
	public showFileStats(fileInfo: FileInfo): void {
		this.clear();
		this._fileInfo = fileInfo;

		// create file size info label
		this._fileSizeInfo = `FileSize: ${formatUtils.formatBytes(this._fileInfo.fileSize)}`;
	}

	/**
 	 * Shows table columns info in vscode status bar.
 	 * 
   * @param columns Table columns descriptor array.
   */
	public showColumns(columns: []): void {
		this._columns = columns;
		this._columnsInfo = `Columns: ${columns.length}`;
	}

	/**
	 * Sets total rows to display for active table view in vscode status bar.
	 */
	public set totalRows(rowCount: number) {
		if (rowCount > 0) {
			this._totalRows = rowCount;

			// update status bar display
			this.showMessage(this._statusMessage);
		}
		else {
			this._totalRows = 0;
		}
	}

	/**
	 * Shows tabular data loading message in vscode status bar.
	 * 
	 * @param message Data loading message to show in status bar.
	 */
	public showMessage(message: string): void {
		this._statusBarItem.text = `中`;
		if (message && message.length > 0) {
			this._statusMessage = message;
			this._statusBarItem.text += ` $(sync~spin) ${message} \t`;
		}

		if (this._totalRows > 0) {
			// append rows count
			this._statusBarItem.text += ` Rows: ${this._totalRows.toLocaleString()} \t`;
		}

		if (this._columns.length > 0) {
			// append columns info
			this._statusBarItem.text += ` ${this._columnsInfo} \t`;
		}

		// append file size info
		this._statusBarItem.text += ` ${this._fileSizeInfo}`;
		this.show();
	}

	/**
 	 * Shows tabular data status display.
 	 */
	public show(): void {
		this._statusBarItem.show();
	}

	/**
	 * Clears and hides tabular data stats display.
	 */
	public hide(): void {
		this.clear();
		this._statusBarItem.hide();
	}

	/**
	 * Clears active tabular data view stats display.
	 */
	public clear(): void {
		this._fileInfo = undefined;
		this._columns = [];
		this._totalRows = 0;
		this._statusMessage = '';
		this._statusBarItem.text = '';
	}

	/**
	 * Disposes status bar UI components.
	 */
	public dispose(): void {
		this._statusBarItem.dispose();
	}
}

export const statusBar = StatusBar.instance;

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

		// show initial loading data message
		this.showMessage('Loading data');
	}

	/**
	* Creates status bar singleton instance.
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
		this._fileInfo = fileInfo;
		this._fileSizeInfo = `FileSize: ${formatUtils.formatBytes(this._fileInfo.fileSize)}`;
		statusBar.showMessage('Loading data');
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
	 * Hides tabular data status display.
	 */
	public hide(): void {
		this._statusBarItem.hide();
	}
}

export const statusBar = StatusBar.instance;

/**
 * Tabular data view commands.
 */
export const enum ViewCommands {
	// tabular data viewer commands
	listDataPackages = 'tabular.data.listDataPackages',
	listDataResources = 'tabular.data.listDataResources',
	openDataFile = 'tabular.data.openDataFile',
	openTextDocument = 'tabular.data.openTextDocument',
	viewTable = 'tabular.data.viewTable',
	viewDataFileOnGithub = 'tabular.data.viewDataFileOnGithub',
	viewSettings = 'tabular.data.viewSettings',

	// built-in vscode commands
	setContext = 'setContext',
	vscodeOpen = 'vscode.open',
	vscodeOpenExternal = 'vscode.openExternal',
	workbenchOpenSettings = 'workbench.action.openSettings',
}

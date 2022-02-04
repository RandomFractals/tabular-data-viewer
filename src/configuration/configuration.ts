import { workspace } from 'vscode';

import { Settings } from './settings';
import { ViewThemes } from '../views/viewThemes';

/**
 * Extension id for tabular data configuration settings lookup.
 */
export const extensionId: string = 'tabular.data';

/**
 * Data packages for the built-in Data Packages gallery
 * and tabular.data.listDataPackages sample data picker command.
 */
export const dataPackages = require('./packages.json');

/**
 * Gets tabular data configuration setting
 * from global user or project workspace settings.
 * 
 * @param settingName Configuration setting name/key.
 * @returns Configuration setting value.
 */
export function get(settingName: string): any {
	return workspace.getConfiguration(extensionId).get(settingName);
}

/**
 * Data view type imports for table view html template.
 */
// TODO: refactor this later and switch to using JS modules and JSX for data view templates.
export const viewImports: any = {
	tabulator: `<link href="https://unpkg.com/tabulator-tables@5.1.0/dist/css/tabulator.min.css" rel="stylesheet">
    <script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.1.0/dist/js/tabulator.min.js"></script>`,
	
	perspective: `<script type="text/javascript" src="https://unpkg.com/@finos/perspective@1.1.0/dist/umd/perspective.js"></script>
    <script type="module" src="https://unpkg.com/@finos/perspective-viewer@1.1.0/dist/cdn/perspective-viewer.js"></script>
    <script type="module" src="https://unpkg.com/@finos/perspective-viewer-datagrid@1.1.0/dist/cdn/perspective-viewer-datagrid.js"></script>
    <script type="module" src="https://unpkg.com/@finos/perspective-viewer-d3fc@1.1.0/dist/cdn/perspective-viewer-d3fc.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@finos/perspective-viewer@1.1.0/dist/css/material-dense.css" />`
};

/**
 * Gets view imports for the specified data view type.
 * 
 * @param dataViewType Tabular data view type.
 * @returns JS and CSS imports to use for the tabular data webview html.
 */
export function getViewImports(dataViewType: string): string {
	let imports: string = viewImports[dataViewType];

	// get data UI theme preference
	const uiTheme: string = <string>get(Settings.DataUiTheme);
	if (uiTheme === ViewThemes.Dark) {
		// reset imported stylesheets to dark
		switch (dataViewType) {
			case 'tabulator':
				imports = imports.replace('tabulator.min.css', 'tabulator_midnight.min.css');
				break;
			case 'perspective':
				imports = imports.replace('material-dense.css', 'material-dense.dark.css');
				break;
		}
	}
	return imports;
}

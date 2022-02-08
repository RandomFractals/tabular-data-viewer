import { ExtensionContext } from 'vscode';

import { registerListDataPackagesCommand } from './listDataPackages';
import { registerListDataResourcesCommand } from './listDataResources';
import { registerOpenDataFileCommand } from './openDataFile';
import { registerOpenTextDocumentCommand } from './openTextDocument';
import { registerViewTableCommand } from './viewTable';
import { registerViewDataFileOnGitHubCommand } from './viewDataFileOnGitHub';
import { registerViewSettingsCommand } from './viewSettings';

/**
 * Registers all Tabular Data: commands for this extension.
 * 
 * @param context Extension context.
 */
export async function registerTabularDataCommands(context: ExtensionContext) {
	registerListDataPackagesCommand(context);
	registerListDataResourcesCommand(context);
	registerOpenDataFileCommand(context);
	registerOpenTextDocumentCommand(context);
	registerViewTableCommand(context);
	registerViewDataFileOnGitHubCommand(context);
	registerViewSettingsCommand(context);
}

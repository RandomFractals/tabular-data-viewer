import { workspace } from 'vscode';

/**
 * Extension id for tabular data configuration settings lookup.
 */
export const extensionId: string = 'tabular.data';

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

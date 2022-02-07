import {
  commands,
  ExtensionContext,
  Disposable,
  Uri
} from 'vscode';

import * as config from '../configuration/configuration';

import { ViewCommands } from './viewCommands';

/**
 * Registers Tabular Data: View Settings command for the Tabular Data Viewer
 * configuration settings listed in package.json.
 * 
 * @param context Extension context.
 */
export async function registerViewSettingsCommand(context: ExtensionContext) {
  const viewSettingsCommand: Disposable =
    commands.registerCommand(ViewCommands.viewSettings, () => {
      commands.executeCommand(ViewCommands.workbenchOpenSettings, config.extensionId);
    });
  context.subscriptions.push(viewSettingsCommand);
}

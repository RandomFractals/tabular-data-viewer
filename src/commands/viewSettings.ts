import {
  commands,
  ExtensionContext,
  Disposable,
  Uri
} from 'vscode';

import * as config from '../configuration/configuration';
import { ViewCommands } from './viewCommands';

export async function registerViewSettingsCommand(context: ExtensionContext) {
  const viewSettingsCommand: Disposable =
    commands.registerCommand(ViewCommands.viewSettings, () => {
      commands.executeCommand(ViewCommands.workbenchOpenSettings, config.extensionId);
    });
  context.subscriptions.push(viewSettingsCommand);
}

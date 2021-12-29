import {
  commands,
  ExtensionContext,
  Disposable,
  Uri
} from 'vscode';

import { ViewCommands } from './viewCommands';
import { TableView } from '../views/tableView';

export async function registerViewTableCommands(context: ExtensionContext) {
  // register view table command
  const viewTableCommand: Disposable =
    commands.registerCommand(ViewCommands.viewTable, (documentUri: Uri) => {
      TableView.render(context.extensionUri, documentUri);
    });

  context.subscriptions.push(viewTableCommand);
}

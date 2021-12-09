
import {
  Disposable,
  ViewColumn,
  WebviewOptions,
  WebviewPanel,
  WebviewPanelOptions,
  window
} from 'vscode';

export class TableView {
  public static currentView: TableView | undefined;
  private readonly _webviewPanel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(webviewPanel: WebviewPanel) {
    this._webviewPanel = webviewPanel;
    this._webviewPanel.onDidDispose(this.dispose, null, this._disposables);
    this._webviewPanel.webview.html = this.getWebviewContent();
  }

  public static render() {
    if (TableView.currentView) {
      TableView.currentView._webviewPanel.reveal(ViewColumn.Active);
    }
    else {
      const webviewPanel = window.createWebviewPanel('tableView', 'Table View', {
          viewColumn: ViewColumn.Active,
          preserveFocus: true
        }, {
          // TODO: add weview panel options
        }
      );
      TableView.currentView = new TableView(webviewPanel);
    }
  }

  public dispose() {
    TableView.currentView = undefined;
    this._webviewPanel.dispose();
    while (this._disposables.length) {
      const disposable: Disposable | undefined = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private getWebviewContent() {
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello World!</title>
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `;
  }
}
# tabular-data-viewer

[![Apache-2.0 License](https://img.shields.io/badge/license-Apache2-brightgreen.svg)](http://opensource.org/licenses/Apache-2.0)
<a href='https://ko-fi.com/dataPixy' target='_blank' title='support: https://ko-fi.com/dataPixy'>
  <img height='24' style='border:0px;height:20px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' alt='https://ko-fi.com/dataPixy' /></a>

<h1 align="center">
  <img width="128" height="128" src="resources/icons/tabular-data-viewer.png" />
  <br />
  Tabular Data Viewer 中 for Visual Studio Code
</h1>

See [Data Preview](https://github.com/RandomFractals/vscode-data-preview) 🈸 vscode extension for advanced [Grid Data Viewer](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-data-preview) with many common data formats support, search, sort, filters, grouping, splits, pivot tables, aggregates and basic charts 📊.

# Tabular Data Viewer 中

Tabular Data Viewer 🀄 provides custom Table View for `.csv`, `.tsv` and `.tab` data files with <a title="Tabulator" href="http://tabulator.info"><img width="95" height="20" src="docs/images/tabulator.png" /></a>:

![Tabular Data View 中](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-view.png?raw=true 
 "Tabular Data View 中")
# Features

- View large [`CSV`](https://en.wikipedia.org/wiki/Comma-separated_values) and [`TSV`](https://en.wikipedia.org/wiki/Tab-separated_values) data files in a custom [Tabulator](http://tabulator.info/) Table View 🀄
- Sort data by multiple columns
- Resize table columns
- Rearrange table columns and rows
- Copy data to Clipboard
- Delete table rows

...

# Contributions

Commands, languages, editor/view types and activation events contributed to VSCode IDE by Tabular Data Viewer 中:

![Tabular Data Viewer 中 Feature Contributions](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-feature-contributions.png?raw=true 
 "Tabular Data Viewer 中 Feature Contributions")

# Dev Log

See [#TabularDataViewer 🀄 tag on Twitter](https://twitter.com/hashtag/TabularDataViewer?src=hashtag_click&f=live) for the latest and greatest updates on this vscode extension and what's in store next.

# Dev Build

```bash
$ git clone https://github.com/RandomFractals/tabular-data-viewer
$ cd tabular-data-viewer
$ npm install
$ npm run compile
$ code .
```
Press `F5` to launch Tabular Data Viewer 🀄 extension debug session, or run the following command to generate `tabular-data-viewer-x.x.x.vsix` package with [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce) from our latest for local dev [install from `.vsix`](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix) in vscode.

```bash
tabular-data-viewer>vsce package
```

# Contributing

Any and all test, code or feedback contributions are welcome. Open an [issue](https://github.com/RandomFractals/tabular-data-viewer/issues) or submit a [pull request](https://docs.github.com/en/pull-requests) to make this Tabular Data Viewer 🀄 extension work better for all.

# Backers

<a href='https://ko-fi.com/dataPixy' target='_blank'>
  <img height='36' style='border:0px;height:36px;' border='0'
    src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' 
    alt='support me on ko-fi.com' />
</a>
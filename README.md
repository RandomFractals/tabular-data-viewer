# tabular-data-viewer

[![Apache-2.0 License](https://img.shields.io/badge/license-Apache2-brightgreen.svg)](http://opensource.org/licenses/Apache-2.0)
[![Version](https://vsmarketplacebadge.apphb.com/version-short/RandomFractalsInc.tabular-data-viewer.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/RandomFractalsInc.tabular-data-viewer.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads/RandomFractalsInc.tabular-data-viewer.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer)
<a href='https://ko-fi.com/dataPixy' target='_blank' title='support: https://ko-fi.com/dataPixy'>
  <img height='24' style='border:0px;height:20px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' alt='https://ko-fi.com/dataPixy' /></a>

<h1 align="center">
  <img width="128" height="128" src="resources/icons/tabular-data-viewer.png" />
  <br />
  Tabular Data Viewer 中 for Visual Studio Code
</h1>

See [Data Preview](https://github.com/RandomFractals/vscode-data-preview) 🈸 vscode extension for advanced [Grid Data Viewer](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-data-preview) with many common data formats support, search, sort, filters, grouping, splits, pivot tables, aggregates and basic charts 📊.

# Tabular Data Viewer 中

[Tabular Data Viewer](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer) provides fast [`DSV`](https://en.wikipedia.org/wiki/Delimiter-separated_values) data loading and custom Table View 🀄 display for very large (1-8 GB) `.csv`, `.tsv` and `.tab` data files via <a title="Tabulator" href="http://tabulator.info"><img width="95" height="20" src="docs/images/tabulator.png" /></a> table and [Papa Parse](https://www.papaparse.com/) CSV parser with [NodeJS File Streams](https://nodejs.dev/learn/nodejs-streams) and [Worker threads](https://nodejs.org/api/worker_threads.html):

![Tabular Data View 中](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-view.png?raw=true 
 "Tabular Data View 中")
# Features

- View large [`CSV`](https://en.wikipedia.org/wiki/Comma-separated_values) and [`TSV`](https://en.wikipedia.org/wiki/Tab-separated_values) data files in a custom [Tabulator](http://tabulator.info/) Table View 🀄
- Open Data File Table View 🀄 via quick file path input prompt
- Load large datasets with millions of rows and over 1GB of tabular data using [Papa Parse](https://www.papaparse.com/) CSV parser in a worker thread with data streaming and incremental loading into Table View 🀄
- View data loading progress, file size, colulmns, rows and load time stats display in vscode status bar
- Sort displayed table data by multiple columns
- Resize table columns
- Rearrange table columns and rows
- Hide, freeze, or delete table columns
- Freeze or delete table rows
- Select table rows column
- Persist table columns layout and sort order
- Restore customized table columns and sort configuration on vscode reload
- Copy tab delimited table data to Clipboard
- Save displayed table data in `CSV` (`,` or `;` delimited), `TSV`, `HTML` table, or `JSON` data array format
- Generate and view [Frictionless Table](https://specs.frictionlessdata.io/table-schema/) `*.schema.json` configration file created with [`tableschema-js.infer()`](https://github.com/frictionlessdata/tableschema-js#working-with-validateinfer)
- Load saved table configuration options from auto-generated `*.table.json` config file when reopening previously customized Table View 🀄
- Set default Data Page Size to 1K, 10K, or 100K (default) rows per page via standard vscode `Preferences -> Settings -> Extensions -> Tabular Data Viewer` configuration options to speed up large datasets parsing and loading into Table View 🀄

...

# Limitations

Large CSV data files streaming and display is very alpha and has the following limitations for now:

- Large datasets are paged and loaded into view for display with default page size set to 100K rows per page
- Columns sort only works for the paged data loaded and displayed in Table View 🀄 and doesn't sort data for the whole dataset
- Save data uses [Tabulator Download Table Data](http://tabulator.info/docs/5.0/download) feature and is also limited to max 100k rows for the currently displayed tabular data in Table View 🀄

![Tabular Data View 中 Large Dataset](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-view-large-dataset.png?raw=true 
 "Tabular Data View 中 Large Dataset")

# Contributions

Tabular Data Viewer 中 Settings, Commands, Languages, Custom Editors and Activation Events contributed to VSCode IDE:

![Tabular Data Viewer 中 Feature Contributions](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-feature-contributions.png?raw=true 
 "Tabular Data Viewer 中 Feature Contributions")

## Settings

[Create User or Workspace Settings in vscode](http://code.visualstudio.com/docs/customization/userandworkspace#_creating-user-and-workspace-settings) to change Tabular Data Viewer 中 extension Settings:

| Setting | Type | Default Value | Description |
| ------- | ---- | ------------- | ----------- |
| `tabular.data.pageSize` | integer | `100000` | Default Data Page Size to use for incremental loading and display of large datasets. |
| `tabular.data.parser.dynamicTyping` | boolean | `true` | Enable type conversions for numeric and boolean data fields when parsing CSV data. Set this option to `false` to speed up large datasets parsing and loading. |
| `tabular.data.createTableSchemaConfig` | boolean | `true` | Create [table `*.schema.json`](https://specs.frictionlessdata.io/table-schema/#descriptor) configuration file alongside data file when parsing CSV data. |
| `tabular.data.createTableViewConfig` | boolean | `true` | Create `*.table.json` configuration file alongside data file for saving and restoring customized Table View 🀄 columns and sort settings. |

You can view Tabular Data Viewer 中 Configuration Settings via standard vscode `Preferences -> Settings -> Extensions -> Tabular Data Viewer` Settings view or use custom `Tabular Data: View Settings` command from `View -> Command Palette...` menu prompt by typing `Tabular` in it. Hit Reload ↺ button in open Table View 🀄 after you toggle Tabular Data Settings to activate your configuration changes for an open table view.

![Tabular Data Viewer 中 Configuration Settings](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-settings.png?raw=true 
 "Tabular Data Viewer 中 Configuration Settings")

# Observable JS Notebook

You can try [Tabular Data Viewer 🀄 Observable Notebook 📓](https://observablehq.com/@randomfractals/tabular-data-viewer) with public datasets and supported data formats in a browser:

![Tabular Data Viewer 中 Observable Notebook 📓](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-observable-notebook.png?raw=true 
 "Tabular Data Viewer 中 Observable Notebook 📓")

# Recommended Extensions

Recommended custom dataViz extensions produced by [Random Fractals Inc.](https://marketplace.visualstudio.com/publishers/RandomFractalsInc) and other 3rd party vscode extension devs for working with data 🈸 charts 📈 geo 🗺️ data formats and Interactive Notebooks 📚 in [VSCode](https://code.visualstudio.com/):

| Extension | Description |
| --- | --- |
| [Rainbow CSV 🌈](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) | Highlight CSV and TSV files, Run SQL-like queries |
| [Data Preview 🈸](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-data-preview) | Data Preview 🈸 extension for importing 📤 viewing 🔎 slicing 🔪 dicing 🎲 charting 📊 & exporting 📥 large JSON array/config, YAML, Apache Arrow, Avro & Excel data files |
| [Geo Data Viewer 🗺️](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.geo-data-viewer) | [kepler.gl](https://kepler.gl) Geo Data Analytics tool to gen. some snazzy 🗺️s  w/0 `Py` 🐍 `pyWidgets` ⚙️ `pandas` 🐼 or `react` ⚛️ |
| [Vega Viewer 📈](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-vega-viewer) | Provides Interactive Preview of Vega & Vega-Lite maps 🗺️ & graphs 📈 |
| [Observable JS](https://marketplace.visualstudio.com/items?itemName=GordonSmith.observable-js) | Observable JS compiler with [Observable](https://observablehq.com/@observablehq/observable-for-jupyter-users?collection=@observablehq/observable-for-jupyter-users) `js` and `md` code outline and previews. |
| [JS Notebook 📓 Inspector 🕵️](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.js-notebook-inspector) | Provides Interactive Preview of [Observable JS Notebooks](https://observablehq.com/documentation#notebook-fundamentals) 📚, Notebook 📓 nodes ⎇ & cells ⌗ source code |
| [Data Table 🈸](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-data-table) | Data Table 🈸 renderer for Notebook 📓 cell ⌗ data outputs |
| [Leaflet Map 🌿 🗺️](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-leaflet) | Leaflet Map 🗺️ for Notebook 📓 cell ⌗ data outputs |

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

# Installation

To install, just search for "tabular data viewer" in VSCode and install from there.

If you use VSCodium, you need to download the .vsix file from [our latest build](https://github.com/RandomFractals/tabular-data-viewer/releases) and run the following command:

```bash
code --install-extension tabular-data-viewer-n.n.n.vsix
```

where `n.n.n` is the version number.

# Contributing

Any and all test, code or feedback contributions are welcome. Open an [issue](https://github.com/RandomFractals/tabular-data-viewer/issues) or submit a [pull request](https://docs.github.com/en/pull-requests) to make this Tabular Data Viewer 🀄 extension work better for all.

# Backers

<a href='https://ko-fi.com/dataPixy' target='_blank'>
  <img height='36' style='border:0px;height:36px;' border='0'
    src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' 
    alt='support me on ko-fi.com' />
</a>

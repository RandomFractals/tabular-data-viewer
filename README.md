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

See [Data Preview](https://github.com/RandomFractals/vscode-data-preview) 🈸 vscode extension for advanced [Data Grid Viewer](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-data-preview) with support of many common [data formats](https://github.com/RandomFractals/vscode-data-preview#supported-json-config-binary--excel-data-file-formats) and Save options for smaller datasets.

# Tabular Data Viewer 中

[Tabular Data Viewer](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer) provides fast [`DSV`](https://en.wikipedia.org/wiki/Delimiter-separated_values) data loading and custom Table Views 🀄 for very large (1-8 GB) local and remote `.csv`, `.tsv` and `.tab` data files with <a title="Tabulator" href="http://tabulator.info"><img width="95" height="20" src="docs/images/tabulator.png" /></a> table, <a title="Perspective" href="https://perspective.finos.org"><img width="116" height="10" src="docs/images/perspective.png" /></a> View, [D3FC](https://d3fc.io) Chart Views 📊📈, [Papa Parse](https://www.papaparse.com/) CSV parser, [NodeJS File Streams](https://nodejs.dev/learn/nodejs-streams) and [Worker threads](https://nodejs.org/api/worker_threads.html):

![Tabular Data View 中](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-view.png?raw=true 
 "Tabular Data View 中")
# Features

- View large [`CSV`](https://en.wikipedia.org/wiki/Comma-separated_values) and [`TSV`](https://en.wikipedia.org/wiki/Tab-separated_values) data files in a custom [Tabulator](http://tabulator.info/) Table or [Perspective](https://perspective.finos.org) Data View 🀄
- Open local `file:///` or remote `https://` Data File Table View 🀄 with quick Data File URL input prompt
- Explore over 750 public datasets from the curated list of https://frictionlessdata.io/ [Data Package](https://github.com/RandomFractals/tabular-data-viewer#data-packages) 📦 JSON configs with Tabular Data Resources, and Table Views 🀄 to search, view, and graph in Chart Views 📊 📈
- Load large datasets with millions of rows and over 1GB of tabular data using [Papa Parse](https://www.papaparse.com/) CSV parser in a worker thread with data streaming and incremental loading into Table View 🀄
- View data loading progress, local data file size, colulmns, rows and load time stats display in vscode status bar
- Sort displayed table data by multiple columns
- Resize table columns in Tabulator Table View
- Rearrange table columns in Tabulator Table and Perspective Data Grid views
- Set default Data Page Size to 1K, 10K, or 100K (default) rows per page to speed up large datasets parsing and loading into Table View 🀄
- Auto-save table columns layout, sort order, and Perspective View configs
- Restore customized Table View 🀄 configuration on vscode reload
- Load saved table configuration options from auto-generated `*.table.json` config file when reopening previously customized Table View 🀄
- Generate and view [Frictionless Table](https://specs.frictionlessdata.io/table-schema/) `*.schema.json` configration file created with [`tableschema-js.infer()`](https://github.com/frictionlessdata/tableschema-js#working-with-validateinfer)
- Copy displayed table data to Clipboard in `TSV` format from Tabulator Table View or in `CSV` format from Perspective View
- Save displayed table data in `CSV` (`,` or `;` delimited), `TSV`, `HTML` table, or `JSON` data array format from Tabulator Table View
- Save displayed table data in [Apache Arrow ⋙](https://arrow.apache.org/) data format from Perspective View:

![Data Perspective View 中](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-perspective-view.png?raw=true 
 "Data Perspective View 中")

# Limitations

Large CSV/TSV data files streaming and display is very alpha and has the following limitations for now:

- Large datasets are paged and loaded into view for display with default page size set to 100K rows per page
- Columns sort only works for the paged data loaded and displayed in Table View 🀄 and doesn't sort data for the whole dataset
- Save data is also limited to max 100k rows for the currently displayed tabular data in Table View 🀄

![Tabular Data View 中 Large Dataset](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-view-large-dataset.png?raw=true 
 "Tabular Data View 中 Large Dataset")

# Installation

Install Tabular Data Viewer 中 from VSCode Extensions tab (`ctrl+shift+x`) by searching for `tabular data` in `Extensions: Marketplace` sidebar view, or install it directly from VS Code Marketplace [Tabular Data Viewer 中](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer) extension page in a browser.

![Tabular Data Viewer 中 Installation](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-installation.png?raw=true 
 "Tabular Data Viewer 中 Installation")

## Deployments

Tabular Data Viewer 中 is designed to work with [VSCode Desktop](https://code.visualstudio.com/) IDE version and also works with [GitHub Codespaces](https://github.com/features/codespaces) in a browser: 

![Tabular Data Viewer 中 in Github Codespaces](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-codespaces.png?raw=true 
 "Tabular Data Viewer 中 in Github Codespaces")

Tabular Data Viewer 中 works in [VSCodium](https://vscodium.com/) too. However, VSCodium and other vscode extension compatible IDE flavors are not officially supported as they require additional testing in those IDE variants.

You can use `tabular-data-viewer-x.y.z.vsix` extension packages attached in `Assets` section with every published [release](https://github.com/RandomFractals/tabular-data-viewer/releases) of this extension on github. Follow [install from .vsix](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix) instructions in your vscode extensions compatible IDE or online container service to install it.

If you prefer to use other IDEs that support VSCode extensions published in `.vsix` format and download your extensions from [open-vsx.org](https://open-vsx.org/), we recommend you try older [Data Preview](https://open-vsx.org/extension/RandomFractalsInc/vscode-data-preview) version of this extension.

Currently, there are no plans to publish this extension to Open VSX Registry due to poor publishing experience in that vscode extensions marketplace and low usage by majority of developers.

# Contributions

Tabular Data Viewer 中 Settings, Commands, Languages, Custom Editors and Activation Events contributed to VSCode IDE:

![Tabular Data Viewer 中 Feature Contributions](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-feature-contributions.png?raw=true 
 "Tabular Data Viewer 中 Feature Contributions")

## Settings

[Create User or Workspace Settings in vscode](http://code.visualstudio.com/docs/customization/userandworkspace#_creating-user-and-workspace-settings) to change Tabular Data Viewer 中 extension Settings listed below. All Tabular Data Viewer Settings start with `tabular.data.` prefix, which is omottied in the Settings table below for better display in [VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.tabular-data-viewer).

| Setting `tabular.data.` | Type | Default Value | Description |
| ------- | ---- | ------------- | ----------- |
| `createTableSchemaConfig` | boolean | `true` | Create [table `*.schema.json`](https://specs.frictionlessdata.io/table-schema/#descriptor) configuration file alongside data file when parsing CSV data. |
| `createTableViewConfig` | boolean | `true` | Create `*.table.json` configuration file alongside data file for saving and restoring customized Table View 🀄 columns, sort settings, Perspective View and D3FC Charts 📊📈 config options. |
| `pageSize` | integer | `100000` | Default Data Page Size to use for incremental loading and display of large datasets. |
| `parser.dynamicTyping` | boolean | `true` | Enable type conversions for numeric and boolean data fields when parsing CSV data. Set this option to `false` to speed up large datasets parsing and loading. |
| `ui.theme` | string | `light` | Default data view UI theme to use for tabular data display. Current options include `light` and `dark` UI themes for `Tabulator` and `Perspective` data views. |
| `view` | string | `Tabulator` | Default Tabular Data View type to use for displaying data. Current options include  [`Tabulator`](http://tabulator.info) and [`Perspective`](https://perspective.finos.org). |


You can set your Tabular Data Viewer 中 Configuration Settings by adding them to [`./vscode/settings.json`](https://github.com/RandomFractals/tabular-data-viewer/blob/main/.vscode/settings.json#L14) in your project workspace. The following workspace configuration settings will default Table Views 🀄 to use [Perspective](https://perspective.finos.org/) Data Grid and Dark UI theme for tabular data and basic [D3FC](https://d3fc.io/) Charts 📊📈 display:

```
{
	// Tabular Data Viewer settings for this workspace
	"tabular.data.view": "Perspective",
	"tabular.data.ui.theme": "dark"
}
```

You can also view Tabular Data Viewer 中 Configuration Settings via standard vscode `Preferences -> Settings -> Extensions -> Tabular Data Viewer` Settings view or use custom `Tabular Data: View Settings` command from `View -> Command Palette...` menu prompt by typing `Tabular` in it.

![Tabular Data Viewer 中 Configuration Settings](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-settings.png?raw=true 
 "Tabular Data Viewer 中 Configuration Settings")

Hit Reload ↺ button in an open Table View 🀄 after you toggle Tabular Data Settings to activate your configuration changes.

**Note**: `tabular.data.view` type default and `tabular.data.ui.theme` Setting changes might require you to close and reopen Tabular Data Views for those settings to take effect.

# Commands

Tabular Data Viewer 中 provides a number of global and context specific commands to load and view tabular data files and [Data Packages](https://specs.frictionlessdata.io/data-package/#introduction) 📦.

You can access custom Tabular Data Commands from `View -> Command Palette...` menu (`ctrl+shift+p`) by typing `Tabular` in the command search box:

![Tabular Data 中 Commands](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-commands.png?raw=true 
 "Tabular Data 中 Commands")

All Tabular Data Commands start with `Tabular Data:` prefix, and exposed public Tabular Data Viewer 中 command Ids use `tabular.data.` prefix to enable other extensions to use Table View 🀄 and tabular data list commands.

Some of the Tabular Data Commands like `View Table` and `List Data Resources` are enabled in vscode file explorer and in code editors for the supported data file types and formats via the corresponding context menues in vscode IDE.

Currently supported Tabular Data 中 Commands include:

| Command `tabular.data.` | Name | Description |
| --- | --- | --- |
| `listDataPackages` | List Data Packages | Lists over 750 public Data GitHub Repositories with [`datapackage.json`](https://specs.frictionlessdata.io/data-package/#introduction) configuration files that ship with Tabular Data Viewer 中 v1.8.0 and above for exploring public datasets and Tabular Data Resources. Curated list of those Data Packages 📦 is configured in our [`packages.json`](https://github.com/RandomFractals/tabular-data-viewer/blob/main/src/configuration/packages.json) configuration file. |
| `listDataResources` | List Data Resources | Lists Tabular Data 中 Resources for an open `datapackage.json` file in an active vscode editor or a public dataset GitHub repository selected from the Data Package 📦 Quick Pick List above.|
| `openDataFile` | Open Data File | Prompts for a local `file:///` or remote `https://` Tabular Data Resource or a Data Package 📦 Url to load and view the Data Resource List or a Table View 🀄 for data files. |
| `openTextDocument` | Open Text Document | Opens local Tabular Data Resource in built-in vscode Text Editor, or opens it in a browser for GitHub hosted data sources and other data files loaded via remote `https://` Urls. |
| `viewTable` | View Table | Displays Table View 🀄 for an open Tabular Data file in vsode Editor or from context menus in built-in File Explorer. |
| `viewDataFileOnGitHub` | View Data File on GitHub | Opens public GitHub Repository Data File or a Data Package in a browser. |
| `viewSettings` | View Settings | Displays Tabular Data Viewer 中 Configuration Settings. |

Tabular Data Viewer 中 v1.8.0 and above provides a custom [Uri Handler](https://github.com/RandomFractals/tabular-data-viewer/issues/96) for launching Table Views 🀄 and other `tabular.data` commands from a Url in a browser. All of the listed commands above can be launched from a browser using the following `vscode://` Url format:

```
vscode://RandomFractalsInc.tabular-data-viewer/<command>[#<dataUrl>|?dataUrl=<dataUrl>]
```

which instructs a browser to open VSCode IDE Desktop application, activate Tabular Data Viewer 中 extension, and execute one of the `tabular.data.` commands via system-wide Urls. Commands that require a data file or data package Url accept that parameter via fragment/anchor (#) portion of the Url, or via `dataUrl` query parameter.

For example, the following `vscode://` Url will display Table View 🀄 for the public https://github.com/datasets/world-cities data repository. Copy and paste this Url in your browser to try it:

```
vscode://RandomFractalsInc.tabular-data-viewer/viewTable#https://raw.githubusercontent.com/datasets/world-cities/master/data/world-cities.csv
```

# Data Packages

Tabular Data Viewer 中 v1.8.0 and above ships with alpha support of https://frictionlessdata.io/ Data Package 📦 JSON format and over 750 built-in curated public datasets with Tabular Data 中 Resources for you to search and explore:

![Tabular Data 中 Packages 📦 ](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-packages.png?raw=true 
 "Tabular Data 中 Packages 📦")

Public GitHub repositories have over 12K `datapackage.json` configurations you can browse using this query: https://github.com/search?p=4&q=filename%3Adatapackage.json+language%3AJSON+language%3AJSON&type=Code

You can load those Data Package 📦 configurations to view Tabular Data 中 Resources via `Tabular Data: Open Data File` command. For example, here is how to open Periodic Table `datapackage.json` example: https://github.com/frictionlessdata/examples/blob/main/periodic-table/datapackage.json

![Tabular Data 中 Open Data Package 📦 ](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-open-data-package.png?raw=true 
 "Tabular Data 中 Open Data Package 📦")

# Observable JS Notebooks

You can try [Tabular Data Viewer 🀄 Observable JS Notebook 📓](https://observablehq.com/@randomfractals/tabular-data-viewer) with public datasets and supported data formats in a browser:

![Tabular Data Viewer 中 Observable Notebook 📓](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-observable-notebook.png?raw=true 
 "Tabular Data Viewer 中 Observable Notebook 📓")

You can also experiment with some public Data Packages 📦 and [`datapackage-js`](https://github.com/frictionlessdata/datapackage-js) library in our [Data Package 📦 Observable JS Notebook 📓](https://observablehq.com/@randomfractals/data-package) in a browser:

![Data Package 📦 Observable JS Notebook 📓](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-data-package-notebook.png?raw=true 
 "Data Package 📦 Observable JS Notebook 📓")

# Recommended Extensions

Recommended custom dataViz extensions produced by [Random Fractals Inc.](https://marketplace.visualstudio.com/publishers/RandomFractalsInc) and other 3rd party vscode extension authors for working with data 🈸 charts 📈 geo 🗺️ data formats and Interactive Notebooks 📚 in [VSCode](https://code.visualstudio.com/):

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

# Contributing

Any and all test, code or feedback contributions are welcome. Open an [issue](https://github.com/RandomFractals/tabular-data-viewer/issues) or submit a [pull request](https://docs.github.com/en/pull-requests) to make this Tabular Data Viewer 🀄 extension work better for all.

# Backers

<a href='https://ko-fi.com/dataPixy' target='_blank'>
  <img height='36' style='border:0px;height:36px;' border='0'
    src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' 
    alt='support me on ko-fi.com' />
</a>
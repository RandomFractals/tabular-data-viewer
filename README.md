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

Tabular Data Viewer 中 provides a number of global and context specific commands to load and view tabular data files and [Data Packages](https://specs.frictionlessdata.io/data-package/#introduction) 📦:

![Tabular Data 中 Commands](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-commands.png?raw=true 
 "Tabular Data 中 Commands")

# Observable JS Notebook

You can try [Tabular Data Viewer 🀄 Observable Notebook 📓](https://observablehq.com/@randomfractals/tabular-data-viewer) with public datasets and supported data formats in a browser:

![Tabular Data Viewer 中 Observable Notebook 📓](https://github.com/RandomFractals/tabular-data-viewer/blob/main/docs/images/tabular-data-viewer-observable-notebook.png?raw=true 
 "Tabular Data Viewer 中 Observable Notebook 📓")

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
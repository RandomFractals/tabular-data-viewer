# Change Log

See [releases](https://github.com/RandomFractals/tabular-data-viewer/releases) for source code and `tabular-data-viewer-x.x.x.vsix` extension package download.

## v1.8.0 - [2022-02-10]
- [#96](https://github.com/RandomFractals/tabular-data-viewer/issues/96)
Add UriHandler to open remote tabular data sources from vscode:// Urls in a browser
- [#102](https://github.com/RandomFractals/tabular-data-viewer/issues/102)
Create built-in Data Packages picker
- [#103](https://github.com/RandomFractals/tabular-data-viewer/issues/103)
Update vscode dev dependencies to the latest v1.64.0
- [#104](https://github.com/RandomFractals/tabular-data-viewer/issues/104)
List tabular data resources for a data package
- [#106](https://github.com/RandomFractals/tabular-data-viewer/issues/106)
Use active text editor document Uri for View Table command
- [#107](https://github.com/RandomFractals/tabular-data-viewer/issues/107)
Add Open Text Document command and context menu options for data files displayed in Table View
- [#108](https://github.com/RandomFractals/tabular-data-viewer/issues/108)
Add View Data File on GitHub command and context menus for Table views with public datasets from github
- [#109](https://github.com/RandomFractals/tabular-data-viewer/issues/109)
Move commands registration from src/extension.ts to src/commands/commands.ts
- [#110](https://github.com/RandomFractals/tabular-data-viewer/issues/110)
Package and publish Uri handler and Data Packages support release

## v1.7.0 - [2022-02-02]
- [#53](https://github.com/RandomFractals/tabular-data-viewer/issues/53)
Add remote data loading and display for public https datasets and supported data formats
- [#93](https://github.com/RandomFractals/tabular-data-viewer/issues/93)
Update vscode webview UI toolkit to v0.9.0
- [#97](https://github.com/RandomFractals/tabular-data-viewer/issues/97)
Update Tabulator to v5.1.0
- [#98](https://github.com/RandomFractals/tabular-data-viewer/issues/98)
Use table icon for View Table context menu in open CSV files
- [#99](https://github.com/RandomFractals/tabular-data-viewer/issues/99)
Refine tabular data loading errors
- [#100](https://github.com/RandomFractals/tabular-data-viewer/issues/100)
Package and publish https data files loading release

## v1.6.0 - [2022-01-24]
- [#6](https://github.com/RandomFractals/tabular-data-viewer/issues/6)
Document CUDA drivers and native node modules setup, extraction, and integration in this vscode extension
- [#15](https://github.com/RandomFractals/tabular-data-viewer/issues/15)
Adopt frictionless data standards
- [#56](https://github.com/RandomFractals/tabular-data-viewer/issues/56)
Add large data files for testing data loading and table view display
- [#62](https://github.com/RandomFractals/tabular-data-viewer/issues/62)
Evaluate RevoGrid for displaying large datasets as alternative to Tabulator
- [#63](https://github.com/RandomFractals/tabular-data-viewer/issues/63)
Evaluate regular-table web component and switch to using its virtual data model for large datasets
- [#65](https://github.com/RandomFractals/tabular-data-viewer/issues/65)
Add Perspective library and Open CSV data file with Perspective Viewer option
- [#75](https://github.com/RandomFractals/tabular-data-viewer/issues/75)
Add tabular.data.view configuration option for alternative data views
- [#77](https://github.com/RandomFractals/tabular-data-viewer/issues/77)
Move Tabulator JS and CSS to separate files in /web folder
- [#79](https://github.com/RandomFractals/tabular-data-viewer/issues/79)
Implement Perspective View data loading
- [#80](https://github.com/RandomFractals/tabular-data-viewer/issues/80)
Add tabular.data.ui.theme light and dark options
- [#85](https://github.com/RandomFractals/tabular-data-viewer/issues/85)
Save and restore Perspective view configs in data file *.table.json
- [#88](https://github.com/RandomFractals/tabular-data-viewer/issues/88)
Implement Save as CSV, JSON and Arrow data in Perspective view
- [#90](https://github.com/RandomFractals/tabular-data-viewer/issues/90)
Package and publish new Perspective view release

## v1.5.0 - [2022-01-13]
- [#28](https://github.com/RandomFractals/tabular-data-viewer/issues/28)
Persist table view config settings for restore on vscode reload or after table view tab close
- [#51](https://github.com/RandomFractals/tabular-data-viewer/issues/51)
Add Tabular Data Viewer config options
- [#52](https://github.com/RandomFractals/tabular-data-viewer/issues/52)
Add tabular data viewer config option to auto-save inferred table shema
- [#67](https://github.com/RandomFractals/tabular-data-viewer/issues/67)
Add tabular.data.pageSize config option
- [#69](https://github.com/RandomFractals/tabular-data-viewer/issues/69)
Add View Table Config UI option to Table view toolbar
- [#70](https://github.com/RandomFractals/tabular-data-viewer/issues/70)
Add tabular.data.parser.dynamicTyping on/off config option
- [#71](https://github.com/RandomFractals/tabular-data-viewer/issues/71)
Add Tabular Data: View Settings command
- [#72](https://github.com/RandomFractals/tabular-data-viewer/issues/72)
Add Tabular Data Settings section to README.md
- [#73](https://github.com/RandomFractals/tabular-data-viewer/issues/73)
Package and publish Tabular Data Settings release

## v1.4.0 - [2022-01-10]
- [#64](https://github.com/RandomFractals/tabular-data-viewer/issues/64)
Save and restore table settings on vscode reload
## v1.3.0 - [2022-01-08]
- [#31](https://github.com/RandomFractals/tabular-data-viewer/issues/31)
Resolve reopening table view for a data file after tab close
- [#47](https://github.com/RandomFractals/tabular-data-viewer/issues/47)
Move viewTable command registration to commands/viewTable.ts
- [#48](https://github.com/RandomFractals/tabular-data-viewer/issues/48)
Add Open Data File command with quick input prompt
- [#49](https://github.com/RandomFractals/tabular-data-viewer/issues/49)
Use tableschema-js for data loading instead of d3-dsv
- [#50](https://github.com/RandomFractals/tabular-data-viewer/issues/50)
Use table.iter api with readable stream for loading large data files
- [#54](https://github.com/RandomFractals/tabular-data-viewer/issues/54)
Update Tabulator tables library to v5.0.10
- [#55](https://github.com/RandomFractals/tabular-data-viewer/issues/55)
Use table.getRows('active') in scroll to last/first row
- [#56](https://github.com/RandomFractals/tabular-data-viewer/issues/56)
Add large data files for testing data loading and table view display
- [#57](https://github.com/RandomFractals/tabular-data-viewer/issues/57)
Add rows/columns count, file size and data load time display to vscode status bar
- [#58](https://github.com/RandomFractals/tabular-data-viewer/issues/58)
Investigate slow Tabulator table data loading and Virtual DOM configuration
- [#59](https://github.com/RandomFractals/tabular-data-viewer/issues/59)
Switch to Papa Parse for CSV data loading and parsing in a worker thread
- [#60](https://github.com/RandomFractals/tabular-data-viewer/issues/60)
Add paging for large data files
- [#61](https://github.com/RandomFractals/tabular-data-viewer/issues/61)
Package and publish data streaming update release
## v1.2.0 - [2021-12-28]
- [#44](https://github.com/RandomFractals/tabular-data-viewer/issues/44)
Resolve webview UI toolkit bundling and loading

## v1.1.0 - [2021-12-27]
- [#29](https://github.com/RandomFractals/tabular-data-viewer/issues/29)
Add Save as TSV data UI option
- [#30](https://github.com/RandomFractals/tabular-data-viewer/issues/30)
Change Tabular Data Text Editor default
- [#32](https://github.com/RandomFractals/tabular-data-viewer/issues/32)
Add Scroll to table row UI option to table view toolbar
- [#34](https://github.com/RandomFractals/tabular-data-viewer/issues/34)
Add table row selection column
- [#35](https://github.com/RandomFractals/tabular-data-viewer/issues/35)
Add Tabular Data Viewer to Tabulator Developer Tools repo and docs
- [#36](https://github.com/RandomFractals/tabular-data-viewer/issues/36)
Link homepage in package.json to Tabular Data Viewer github repo
- [#37](https://github.com/RandomFractals/tabular-data-viewer/issues/37)
Add Tabular Data Viewer Observable Notebook to docs
- [#38](https://github.com/RandomFractals/tabular-data-viewer/issues/38)
Add VS Marketplace badge, installs and downloads counters to docs
- [#39](https://github.com/RandomFractals/tabular-data-viewer/issues/39)
Add Rainbow CSV and Random Fractals Inc. dataViz extensions to recommendations in .vscode/extensions.json
- [#40](https://github.com/RandomFractals/tabular-data-viewer/issues/40)
Add Recommended Extensions section to docs
- [#41](https://github.com/RandomFractals/tabular-data-viewer/issues/41)
Split data load/refresh into separate create table and add data transfer operations
- [#42](https://github.com/RandomFractals/tabular-data-viewer/issues/42)
Refactor data download and table settings persistence handlers
- [#43](https://github.com/RandomFractals/tabular-data-viewer/issues/43)
Package and publish Tabular data viewer docs, data table loading, view and toolbar enhancements release

## v1.0.0 - [2021-12-24]

- [#1](https://github.com/RandomFractals/tabular-data-viewer/issues/1)
Scaffold Tabular Data Viewer vscode extension base code
- [#2](https://github.com/RandomFractals/tabular-data-viewer/issues/2)
Add basic project info to docs
- [#4](https://github.com/RandomFractals/tabular-data-viewer/issues/4)
Use Tabulator with Virtual DOM for data display
- [#5](https://github.com/RandomFractals/tabular-data-viewer/issues/5)
Add ./data folder with csv, tsv, json, and arrow data files for testing
- [#7](https://github.com/RandomFractals/tabular-data-viewer/issues/7)
Create custom Tabular Data Viewer extension icon 
- [#8](https://github.com/RandomFractals/tabular-data-viewer/issues/8)
Create Tabular Data Webview
- [#9](https://github.com/RandomFractals/tabular-data-viewer/issues/9)
Add basic CSV/TSV data files loading
- [#10](https://github.com/RandomFractals/tabular-data-viewer/issues/10)
Add multiple Tabular Data views display
- [#11](https://github.com/RandomFractals/tabular-data-viewer/issues/11)
Add Tabular Data view serializer
- [#12](https://github.com/RandomFractals/tabular-data-viewer/issues/12)
Add custom Tabular Data Text Editor provider
- [#13](https://github.com/RandomFractals/tabular-data-viewer/issues/13)
Enable Tabular Data viewer in untrusted workspaces
- [#14](https://github.com/RandomFractals/tabular-data-viewer/issues/14)
Add custom Table view styles to match vscode UI theme
- [#16](https://github.com/RandomFractals/tabular-data-viewer/issues/16)
Add Dev Log, Dev Build, Contributing and Backers sections to README.md
- [#17](https://github.com/RandomFractals/tabular-data-viewer/issues/17)
Add Feature Contributions section to README.md
- [#18](https://github.com/RandomFractals/tabular-data-viewer/issues/18)
Refine package.json for MVP release
- [#19](https://github.com/RandomFractals/tabular-data-viewer/issues/19)
Add .github/FUNDING.yml for project sponsors
- [#20](https://github.com/RandomFractals/tabular-data-viewer/issues/20)
Add proper CHANGELOG.md for MVP release
- [#21](https://github.com/RandomFractals/tabular-data-viewer/issues/21)
Add Freeze Row context menu option
- [#22](https://github.com/RandomFractals/tabular-data-viewer/issues/22)
Persist and load table view config per data file
- [#23](https://github.com/RandomFractals/tabular-data-viewer/issues/23)
Add hide, freeze, and delete column context menu options
- [#24](https://github.com/RandomFractals/tabular-data-viewer/issues/24)
Add data loading progress ring display
- [#25](https://github.com/RandomFractals/tabular-data-viewer/issues/25)
Add Save as CSV or JSON data UI options
- [#26](https://github.com/RandomFractals/tabular-data-viewer/issues/26)
Add Save as HTML data table UI option
- [#27](https://github.com/RandomFractals/tabular-data-viewer/issues/27)
Add Save as semicolon delimited CSV data UI option

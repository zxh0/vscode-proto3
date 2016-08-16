# vscode-proto3

vscode extension for proto3

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

- syntax coloring
- syntax check
- completion

### Snippets

- `sp2`: syntax = "proto3"; 
- `sp3`: syntax = "proto3";
- `pkg`: package package.name;
- `imp`: import "path/to/other/protos.proto";
- `ojp`: option java_package = "java.package.name";
- `ojoc`: option java_outer_classname = "ClassName";
- `o4s`: option optimize_for = SPEED;
- `o4cs`: option optimize_for = CODE_SIZE;
- `o4lr`: option optimize_for = LITE_RUNTIME;
- `odep`: option deprecated = true;
- `oaa`: option allow_alias = true;
- `msg`: message MessageName {}
- `fbo`: bool field_name = tag;
- `fi32`: int32 field_name = tag;
- `fi64`: int64 field_name = tag;
- `fu32`: uint32 field_name = tag;
- `fu64`: uint64 field_name = tag;
- `fs32`: sint32 field_name = tag;
- `fs64`: sint64 field_name = tag;
- `ff32`: fixed32 field_name = tag;
- `ff64`: fixed64 field_name = tag;
- `fsf32`: sfixed32 field_name = tag;
- `fsf64`: sfixed64 field_name = tag;
- `ffl`: float field_name = tag;
- `fdo`: double field_name = tag;
- `fst`: string field_name = tag;
- `fby`: bytes field_name = tag;
- `fm`: map<key, val> field_name = tag;
- `foo`: oneof name = {}

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on OSX or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on OSX or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (OSX) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
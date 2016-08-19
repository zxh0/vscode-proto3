# vscode-proto3

vscode extension for proto3

## Features

- proto3 support.
- syntax highlighting.
- syntax validation.
- code snippets.
- code completion.
- brace matching.
- line and block commenting.

\!\[feature X\]\(images/feature-x.png\)

### Syntax Highlighting

The grammar is written in tmLanguage.
It is written in JSON format and then converted to xml format using 
[vscode-tmlanguage](https://github.com/Togusa09/vscode-tmlanguage) extension.

### Syntax Validation

The validation is triggered when you save the proto file. You need protoc 
compiler to enable syntax validation. You also need a settings.json file 
to tell the extension the full path of protoc if it is not in `path`. 
Bellow is the settings.json file comes from `example` folder:
```json
{
    "protoc": {
        "path": "d:/tools/protoc-3.0.0-win32/bin/protoc.exe",
        "options": [
            "--proto_path=protos/v3",
            "--java_out=gen/java"
        ]
    }
}
```

### Code Completion

A very simple parser is written to support code completion. 

### Code Snippets

prefix| body
----- | -----
sp2   | `syntax = "proto3";`
sp3   | `syntax = "proto3";`
pkg   | `package package.name;`
imp   | `import "path/to/other/protos.proto";`
ojp   | `option java_package = "java.package.name";`
ojoc  | `option java_outer_classname = "ClassName";`
o4s   | `option optimize_for = SPEED;`
o4cs  | `option optimize_for = CODE_SIZE;`
o4lr  | `option optimize_for = LITE_RUNTIME;`
odep  | `option deprecated = true;`
oaa   | `option allow_alias = true;`
msg   | `message MessageName {}`
fbo   | `bool field_name = tag;`
fi32  | `int32 field_name = tag;`
fi64  | `int64 field_name = tag;`
fu32  | `uint32 field_name = tag;`
fu64  | `uint64 field_name = tag;`
fs32  | `sint32 field_name = tag;`
fs64  | `sint64 field_name = tag;`
ff32  | `fixed32 field_name = tag;`
ff64  | `fixed64 field_name = tag;`
fsf32 | `sfixed32 field_name = tag;`
fsf64 | `sfixed64 field_name = tag;`
ffl   | `float field_name = tag;`
fdo   | `double field_name = tag;`
fst   | `string field_name = tag;`
fby   | `bytes field_name = tag;`
fm    | `map<key, val> field_name = tag;`
foo   | `oneof name {}`
en    | `enum EnumName {}`
sv    | `service ServiceName {}`
rpc   | `rpc method_name (Request) returns (Response);`


## Known Issues

Auto-completion not works in some situations.

## TODO

## Release Notes

### 0.1.0

Initial release of vscode-proto3

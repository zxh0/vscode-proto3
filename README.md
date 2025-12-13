![icon](images/vscode_extension_icon.png)

> Salute to the long-standing [zxh0/vscode-proto3](https://github.com/zxh0/vscode-proto3) extension that has accompanied us for so long.

This is an excellent and concise extension in VSCode, and it is well worth our continuous effort to make small optimizations.

## Highlights

- Fast syntax highlighting and validation for `.proto`
- IntelliSense-style completion and snippets
- Compile current/all protos via `protoc`
- One-click renumbering for fields and enums
- Formatting via `clang-format`

![gif1](images/gif1.gif)

## Commands

Open the command palette (**Ctrl+Shift+P** / **Cmd+Shift+P**) and run:

| Command | Description |
| --- | --- |
| `proto3: Compile All Protos` | Compile all workspace protos using configured `protoc.options`. |
| `proto3: Compile This Proto` | Compile the active proto using configured `protoc.options`. |
| `proto3: Renumber Fields/Enum Values` | Renumber fields from `1` and enum values from `0` in the current scope. |

### Renumbering

While inside a message or enum, run `proto3: Renumber Fields/Enum Values`.
Tags are rewritten so fields count up from `1` and enums from `0`.

### Snippets

| prefix | body |
| --- | --- |
| sp2 | `syntax = "proto2";` |
| sp3 | `syntax = "proto3";` |
| pkg | `package package.name;` |
| imp | `import "path/to/other/protos.proto";` |
| ojp | `option java_package = "java.package.name";` |
| ojoc | `option java_outer_classname = "ClassName";` |
| o4s | `option optimize_for = SPEED;` |
| o4cs | `option optimize_for = CODE_SIZE;` |
| o4lr | `option optimize_for = LITE_RUNTIME;` |
| odep | `option deprecated = true;` |
| oaa | `option allow_alias = true;` |
| msg | `message MessageName {}` |
| fbo | `bool field_name = tag;` |
| fi32 | `int32 field_name = tag;` |
| fi64 | `int64 field_name = tag;` |
| fu32 | `uint32 field_name = tag;` |
| fu64 | `uint64 field_name = tag;` |
| fs32 | `sint32 field_name = tag;` |
| fs64 | `sint64 field_name = tag;` |
| ff32 | `fixed32 field_name = tag;` |
| ff64 | `fixed64 field_name = tag;` |
| fsf32 | `sfixed32 field_name = tag;` |
| fsf64 | `sfixed64 field_name = tag;` |
| ffl | `float field_name = tag;` |
| fdo | `double field_name = tag;` |
| fst | `string field_name = tag;` |
| fby | `bytes field_name = tag;` |
| fm | `map<key, val> field_name = tag;` |
| foo | `oneof name {}` |
| en | `enum EnumName {}` |
| sv | `service ServiceName {}` |
| rpc | `rpc MethodName (Request) returns (Response);` |
| svgapi | Google API standard methods |

### Formatting

- Runs `clang-format` if available. Configure via settings:

```json
{
  "clang-format.style": "google",
  "clang-format.executable": "clang-format"
}
```

## Configuration

Example `.vscode/settings.json` (see `example/.vscode`):

```json
{
  "protoc": {
    "path": "/path/to/protoc",
    "compile_on_save": false,
    "options": [
      "--proto_path=protos/v3",
      "--proto_path=protos/v2",
      "--proto_path=${workspaceRoot}/proto",
      "--proto_path=${env.GOPATH}/src",
      "--java_out=gen/java"
    ]
  }
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | string | protoc in PATH | Protoc binary path. |
| `compile_on_save` | boolean | `false` | Compile current file on save. |
| `renumber_on_save` | boolean | `true` | Renumber fields/enums on save. |
| `compile_all_path` | string | Workspace root | Search path for Compile All. |
| `use_absolute_path` | boolean | `false` | Use absolute paths when searching. |
| `options` | string[] | `[]` | Protoc flags for validation/compilation. |

Inline variables supported: `config.*`, `env.*`, `workspaceRoot`.

## Development

- Install dependencies: `npm install`
- Local checks: `npm run verify` (lint, markdown lint, format check, tests with `--forbid-only`)
- Build/package: `npm run package:vsix`
- Release: push a tag `v*.*.*` to trigger CI packaging and GitHub release attachment (no marketplace publish)

## Troubleshooting

- `spawnsync clang-format enoent`: install `clang-format` (`brew install clang-format` on macOS) or update `clang-format.executable`.
- Auto-complete may be limited in complex scopes; please file an issue with a minimal repro.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md). PRs that add tests and keep `npm run verify` passing are welcome.

## Top contributors

![Top contributors](https://contrib.rocks/image?repo=zxh0/vscode-proto3)

See the full list on GitHub in the [contributors graph](https://github.com/zxh0/vscode-proto3/graphs/contributors).

## Release Notes

See [CHANGELOG.md](CHANGELOG.md).

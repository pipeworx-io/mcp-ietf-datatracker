# mcp-ietf-datatracker

IETF Datatracker MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `rfc` | RFC by number. |
| `document` | Document by name (e.g. "rfc9000", "draft-ietf-quic-transport"). |
| `documents_search` | Search documents. |
| `wg` | Working group by acronym. |
| `wgs_search` | List working groups. |
| `person` | Person by datatracker id. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "ietf-datatracker": {
      "url": "https://gateway.pipeworx.io/ietf-datatracker/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Ietf Datatracker data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

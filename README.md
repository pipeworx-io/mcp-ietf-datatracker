# @pipeworx/ietf-datatracker

[IETF Datatracker](https://datatracker.ietf.org) MCP — RFC + Internet-Draft metadata + working groups + people. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `rfc(number)` — RFC by number
- `document(name)` — document by name (e.g. "draft-ietf-quic-transport")
- `documents_search(states?, type?, name__contains?, limit?, offset?)` — search documents
- `wg(acronym)` — working group by acronym
- `wgs_search(limit?, offset?)` — list working groups
- `person(id)` — person by id

## Data source

`https://datatracker.ietf.org/api/v1/` (Tastypie REST).

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

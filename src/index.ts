interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * IETF Datatracker MCP.
 *
 * Auth: none. Docs: https://datatracker.ietf.org/doc/help/api/
 */


const BASE = 'https://datatracker.ietf.org/api/v1';
const UA = 'pipeworx-mcp-ietf-datatracker/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'rfc',
    description: 'RFC by number.',
    inputSchema: {
      type: 'object',
      properties: { number: { type: 'number' } },
      required: ['number'],
    },
  },
  {
    name: 'document',
    description: 'Document by name (e.g. "rfc9000", "draft-ietf-quic-transport").',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  },
  {
    name: 'documents_search',
    description: 'Search documents.',
    inputSchema: {
      type: 'object',
      properties: {
        states: { type: 'string', description: 'Comma-sep state ids (e.g. "active").' },
        type: { type: 'string', description: 'draft | rfc | charter | conflrev | …' },
        name__contains: { type: 'string', description: 'Substring filter on the name.' },
        limit: { type: 'number', description: '1-1000 (default 20).' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'wg',
    description: 'Working group by acronym.',
    inputSchema: {
      type: 'object',
      properties: { acronym: { type: 'string' } },
      required: ['acronym'],
    },
  },
  {
    name: 'wgs_search',
    description: 'List working groups.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'person',
    description: 'Person by datatracker id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'rfc': {
      const num = (args.number as number) | 0;
      if (!num) throw new Error('Required argument "number" must be a positive RFC number.');
      const params = new URLSearchParams({ rfc: String(num) });
      return ietfGet(`/doc/document/?${params}`);
    }
    case 'document': {
      const params = new URLSearchParams({ name: reqStr(args, 'name', '"rfc9000"') });
      return ietfGet(`/doc/document/?${params}`);
    }
    case 'documents_search': {
      const params = new URLSearchParams({
        format: 'json',
        limit: String(Math.min(1000, Math.max(1, (args.limit as number) ?? 20))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
      });
      if (args.states) params.set('states__slug__in', String(args.states));
      if (args.type) params.set('type', String(args.type));
      if (args.name__contains) params.set('name__contains', String(args.name__contains));
      return ietfGet(`/doc/document/?${params}`);
    }
    case 'wg': {
      const params = new URLSearchParams({ acronym: reqStr(args, 'acronym', '"quic"') });
      return ietfGet(`/group/group/?${params}`);
    }
    case 'wgs_search': {
      const params = new URLSearchParams({
        type__slug: 'wg',
        format: 'json',
        limit: String(Math.min(1000, Math.max(1, (args.limit as number) ?? 20))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
      });
      return ietfGet(`/group/group/?${params}`);
    }
    case 'person':
      return ietfGet(`/person/person/${(args.id as number) | 0}/?format=json`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function ietfGet(path: string): Promise<unknown> {
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}format=json`;
  const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('IETF Datatracker: not found');
  if (!res.ok) throw new Error(`IETF Datatracker: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), 'scholars-db.json');

interface Country {
  id: number;
  en: string;
  ar: string;
}

interface Category {
  id: number;
  en: string;
  ar: string;
}

interface Scholar {
  id: number;
  name: Record<string, string>;
  socialMedia: { platform: string; link: string; icon?: string }[];
  countryId: number;
  categoryId: number;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
}

interface ScholarStore {
  countries: Country[];
  specializations: any[];
  scholars: Scholar[];
  categories: Category[];
  metadata: { last_updated: string; version: string };
}

let store: ScholarStore = {
  countries: [],
  specializations: [],
  scholars: [],
  categories: [],
  metadata: { last_updated: '', version: '1.0.0' }
};

function loadDatabase(): void {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      store = JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load database:', error);
  }
}

function saveDatabase(): void {
  try {
    store.metadata.last_updated = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

function generateId(): number {
  const maxId = store.scholars.reduce((max, s) => Math.max(max, s.id), 0);
  return maxId + 1;
}

const server = new McpServer({
  name: 'voices-of-truth-mcp',
  version: '1.0.0'
});

server.registerTool('list_scholars', {
  description: 'List all scholars with optional filters',
  inputSchema: z.object({
    categoryId: z.number().optional(),
    countryId: z.number().optional(),
    language: z.string().optional()
  })
}, async ({ categoryId, countryId, language }) => {
  loadDatabase();
  let scholars = store.scholars;
  if (categoryId !== undefined) scholars = scholars.filter(s => s.categoryId === categoryId);
  if (countryId !== undefined) scholars = scholars.filter(s => s.countryId === countryId);
  if (language) scholars = scholars.filter(s => s.language.includes(language));
  return { content: [{ type: 'text', text: JSON.stringify(scholars, null, 2) }] };
});

server.registerTool('get_scholar', {
  description: 'Get scholar by ID',
  inputSchema: z.object({ id: z.number() })
}, async ({ id }) => {
  loadDatabase();
  const scholar = store.scholars.find(s => s.id === id);
  if (!scholar) return { content: [{ type: 'text', text: 'Scholar not found' }] };
  return { content: [{ type: 'text', text: JSON.stringify(scholar, null, 2) }] };
});

server.registerTool('list_categories', {
  description: 'List all categories',
  inputSchema: z.object({})
}, async () => {
  loadDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(store.categories, null, 2) }] };
});

server.registerTool('list_countries', {
  description: 'List all countries',
  inputSchema: z.object({})
}, async () => {
  loadDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(store.countries, null, 2) }] };
});

server.registerTool('search_scholars', {
  description: 'Search scholars by name, language, or country',
  inputSchema: z.object({
    query: z.string(),
    lang: z.string().optional()
  })
}, async ({ query, lang }) => {
  loadDatabase();
  const q = query.toLowerCase();
  let results = store.scholars.filter(s =>
    s.name.en?.toLowerCase().includes(q) ||
    s.name.ar?.includes(q) ||
    s.bio?.en?.toLowerCase().includes(q) ||
    s.bio?.ar?.includes(q)
  );
  if (lang) results = results.filter(s => s.language.includes(lang));
  return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
});

server.registerTool('get_statistics', {
  description: 'Get directory statistics',
  inputSchema: z.object({})
}, async () => {
  loadDatabase();
  const stats = {
    total_scholars: store.scholars.length,
    by_category: Object.fromEntries(
      store.categories.map(c => [c.en, store.scholars.filter(s => s.categoryId === c.id).length])
    ),
    by_language: Object.fromEntries(
      [...new Set(store.scholars.flatMap(s => s.language))].map(l => [l, store.scholars.filter(s => s.language.includes(l)).length])
    ),
    by_country: Object.fromEntries(
      store.countries.map(c => [c.en, store.scholars.filter(s => s.countryId === c.id).length])
    )
  };
  return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };
});

server.registerTool('add_scholar', {
  description: 'Add a new scholar',
  inputSchema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    countryId: z.number(),
    categoryId: z.number(),
    language: z.array(z.string()).optional(),
    avatarUrl: z.string().optional()
  })
}, async ({ name, countryId, categoryId, language, avatarUrl }) => {
  loadDatabase();
  const newScholar: Scholar = {
    id: generateId(),
    name,
    countryId,
    categoryId,
    language: language || [],
    avatarUrl: avatarUrl || '',
    socialMedia: [],
    bio: {}
  };
  store.scholars.push(newScholar);
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(newScholar, null, 2) }] };
});

server.registerTool('update_scholar', {
  description: 'Update existing scholar',
  inputSchema: z.object({
    id: z.number(),
    name: z.object({ en: z.string(), ar: z.string() }).optional(),
    countryId: z.number().optional(),
    categoryId: z.number().optional(),
    language: z.array(z.string()).optional(),
    avatarUrl: z.string().optional()
  })
}, async ({ id, ...updates }) => {
  loadDatabase();
  const idx = store.scholars.findIndex(s => s.id === id);
  if (idx === -1) return { content: [{ type: 'text', text: 'Scholar not found' }] };
  store.scholars[idx] = { ...store.scholars[idx], ...updates } as Scholar;
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(store.scholars[idx], null, 2) }] };
});

server.registerTool('remove_scholar', {
  description: 'Remove a scholar',
  inputSchema: z.object({ id: z.number() })
}, async ({ id }) => {
  loadDatabase();
  const idx = store.scholars.findIndex(s => s.id === id);
  if (idx === -1) return { content: [{ type: 'text', text: 'Scholar not found' }] };
  store.scholars.splice(idx, 1);
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
});

server.registerTool('add_category', {
  description: 'Add new category',
  inputSchema: z.object({ en: z.string(), ar: z.string() })
}, async ({ en, ar }) => {
  loadDatabase();
  const newCat: Category = { id: store.categories.length + 1, en, ar };
  store.categories.push(newCat);
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(newCat, null, 2) }] };
});

server.registerTool('add_country', {
  description: 'Add new country',
  inputSchema: z.object({ en: z.string(), ar: z.string() })
}, async ({ en, ar }) => {
  loadDatabase();
  const newCountry: Country = { id: store.countries.length + 1, en, ar };
  store.countries.push(newCountry);
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(newCountry, null, 2) }] };
});

server.registerTool('batch_import_scholars', {
  description: 'Import multiple scholars',
  inputSchema: z.object({ scholars: z.array(z.any()) })
}, async ({ scholars }) => {
  loadDatabase();
  for (const s of scholars as Scholar[]) {
    store.scholars.push({ ...s, id: generateId() });
  }
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify({ imported: scholars.length }) }] };
});

server.registerTool('link_social_media', {
  description: 'Add social media to scholar',
  inputSchema: z.object({
    scholarId: z.number(),
    platform: z.string(),
    link: z.string(),
    icon: z.string().optional()
  })
}, async ({ scholarId, platform, link, icon }) => {
  loadDatabase();
  const scholar = store.scholars.find(s => s.id === scholarId);
  if (!scholar) return { content: [{ type: 'text', text: 'Scholar not found' }] };
  scholar.socialMedia.push({ platform, link, icon });
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(scholar) }] };
});

server.registerTool('set_avatar', {
  description: 'Update scholar avatar',
  inputSchema: z.object({ scholarId: z.number(), avatarUrl: z.string() })
}, async ({ scholarId, avatarUrl }) => {
  loadDatabase();
  const scholar = store.scholars.find(s => s.id === scholarId);
  if (!scholar) return { content: [{ type: 'text', text: 'Scholar not found' }] };
  scholar.avatarUrl = avatarUrl;
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(scholar) }] };
});

server.registerTool('localize_scholar', {
  description: 'Add translations for scholar',
  inputSchema: z.object({
    scholarId: z.number(),
    name: z.object({ en: z.string(), ar: z.string() }).optional()
  })
}, async ({ scholarId, name }) => {
  loadDatabase();
  const scholar = store.scholars.find(s => s.id === scholarId);
  if (!scholar) return { content: [{ type: 'text', text: 'Scholar not found' }] };
  if (name) scholar.name = { ...scholar.name, ...name };
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify(scholar) }] };
});

server.registerTool('reorder_categories', {
  description: 'Reorder category display',
  inputSchema: z.object({ order: z.array(z.number()) })
}, async ({ order }) => {
  loadDatabase();
  store.categories = order.map((id, idx) => {
    const cat = store.categories.find(c => c.id === id);
    return cat ? { ...cat, id: idx + 1 } : null;
  }).filter(Boolean) as Category[];
  saveDatabase();
  return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
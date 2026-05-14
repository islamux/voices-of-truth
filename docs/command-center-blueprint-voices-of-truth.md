# Voices of Truth - Scholar Browser Command Center

> A build specification for managing the Voices of Truth scholar directory.
> Adapted from the Command Center Blueprint for this Next.js project.

---

## About This Document

### What This Builds

A **Command Center** for managing the scholar directory with:

1. **MCP Server** — Node.js package exposing tools to manage scholars, categories, languages, and countries. AI agents can add/edit scholars and filter the directory.

2. **Textual TUI App** — Python terminal interface with 4 views: Scholar Grid (card view), Filter Panel, Category Map, and Language Stats.

Both share `scholars-db.json` as the single source of truth.

### Architecture

```
┌────────────────────────────────────────────────┐
│           Textual TUI Terminal App              │
│        (Scholar Grid, Filter Panel,          │
│         Category Map, Language Stats)         │
└───────────────────┬────────────────────────────┘
                    │ Watchdog fs.watch
┌───────────────────▼────────────────────────────┐
│            scholars-db.json                      │
│          (Single Source of Truth)              │
└───────────────────▲────────────────────────────┘
                    │ MCP read/write
┌───────────────────┴────────────────────────────┐
│          MCP Server (tools)                     │
│            + CLI interface                      │
└───────────────────▲────────────────────────────┘
                    │ MCP protocol
        ┌───────────┴───────────┐
        │      AI Agents         │
  ┌─────▼──────┐         ┌─────▼──────┐
  │ Claude Code│         │   Codex    │
  └────────────┘         └────────────┘
```

### Stack

| Layer | Technology |
|-------|-----------|
| TUI Framework | Python 3.11+ with Textual 0.95+ |
| Rich Text | Rich library for terminal rendering |
| File Watching | Watchdog |
| Data Validation | Pydantic |
| MCP Server | Node.js + @modelcontextprotocol/sdk |
| Language | Python (TUI) + TypeScript (MCP) |

---

## PHASE 1: SCHOLAR SCHEMA

### TypeScript Interfaces

```typescript
interface Country {
  id: number;
  en: string;
  ar: string;
}

interface Specialization {
  id: number;
  en: string;
  ar: string;
}

interface Scholar {
  id: number;
  name: Record<string, string>;  // { en: string, ar: string }
  socialMedia: {
    platform: string;
    link: string;
    icon?: string;
  }[];
  countryId: number;
  categoryId: number;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
}

interface ScholarStore {
  countries: Country[];
  specializations: Specialization[];
  scholars: Scholar[];
  categories: Category[];
  metadata: {
    last_updated: string;
    version: string;
  };
}
```

### Category Structure

Categories represent Islamic scholarly disciplines:
- Comparative Religion
- Contemporary Islamic Thought
- Dawah
- Hadith Studies
- Interfaith Dialogue
- Islamic History
- Islamic Jurisprudence (Fiqh)
- Islamic Thought
- Quran Interpretation (Tafsir)
- Quran Studies
- Spirituality & Ethics

### Existing Data

The current project has:
- `src/types/index.ts` — Core interfaces
- `src/data/scholars.ts` — Scholar arrays organized by category
- `public/locales/{en,ar}/*.json` — i18n translation files

### Empty Store

```json
{
  "countries": [],
  "specializations": [],
  "scholars": [],
  "categories": [],
  "metadata": {
    "last_updated": "",
    "version": "1.0.0"
  }
}
```

> **Checkpoint:** Create `scholars-db.json` at project root.

---

## PHASE 2: MCP SERVER

### Project Structure

```
voices-of-truth-mcp/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts      # MCP server entry
    ├── tools.ts      # Tool definitions
    ├── schema.ts     # Types + validation
    ├── context.ts    # Markdown builders
    └── cli.ts        # CLI interface
```

### Tool Categories

**Read Tools (6):**
- `list_scholars` — List all scholars with optional filters
- `get_scholar` — Get scholar by ID
- `list_categories` — List all categories
- `list_countries` — List all countries
- `search_scholars` — Search by name, language, or country
- `get_statistics` — Get directory statistics

**Write Tools (10):**
- `add_scholar` — Add a new scholar
- `update_scholar` — Update existing scholar
- `remove_scholar` — Remove a scholar
- `add_category` — Add new category
- `add_country` — Add new country
- `batch_import_scholars` — Import multiple scholars
- `link_social_media` — Add social media to scholar
- `set_avatar` — Update scholar avatar
- `localize_scholar` — Add translations for scholar
- `reorder_categories` — Reorder category display

### CLI Examples

```bash
voices-of-truth list-scholars --category quran-studies
voices-of-truth add-scholar "Sheikh Ahmad" --country 1 --category 1
voices-of-truth search "Islamic philosophy" --lang ar
voices-of-truth get-statistics
```

> **Checkpoint:** CLI works. Test with `voices-of-truth list-categories`.

---

## PHASE 3: TEXTUAL SHELL

### Project Structure

```
voices-of-truth-tui/
├── pyproject.toml
├── requirements.txt
├── voices_of_truth/
│   ├── __init__.py
│   ├── __main__.py      # Entry point
│   ├── app.py           # Main Textual app
│   ├── store.py         # State management
│   ├── config.py        # Path resolution
│   ├── widgets/
│   │   ├── __init__.py
│   │   ├── header.py
│   │   ├── tab_bar.py
│   │   ├── status_bar.py
│   │   ├── scholar_card.py
│   │   └── filter_panel.py
│   ├── screens/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── scholar_grid.py
│   │   ├── filter_panel.py
│   │   ├── category_map.py
│   │   └── language_stats.py
│   └── utils/
│       ├── __init__.py
│       ├── colors.py
│       ├── selectors.py
│       └── render.py
```

### Dependencies

```
textual>=0.95.0
rich>=13.7.0
watchdog>=4.0.0
pydantic>=2.0.0
```

### Main App

```python
from textual.app import App, ComposeResult
from textual.containers import Container
from watchdog.observers import Observer

class VoicesOfTruthApp(App):
    CSS = """
    Screen { background: $surface; }
    """
    
    def __init__(self, db_path: str):
        super().__init__()
        self.db_path = db_path
        self.store = Store()
    
    def on_mount(self):
        self.observer = Observer()
        self.observer.schedule(ScholarDBHandler(self), 
                               path=self.db_path)
        self.observer.start()
        self.load_db()
    
    def on_unmount(self):
        self.observer.stop()
    
    def compose(self) -> ComposeResult:
        yield Header()
        yield Container(TabBar(), StatusBar())
        yield Footer()
```

### Entry Point

```python
# voices_of_truth/__main__.py
from .app import VoicesOfTruthApp
from .config import get_db_path

def main():
    path = get_db_path()
    app = VoicesOfTruthApp(str(path))
    app.run()

if __name__ == "__main__":
    main()
```

### Run

```bash
pip install -e voices-of-truth-tui/
voices-of-truth-tui
# or
python -m voices_of_truth
```

> **Checkpoint:** App launches, shows tabs, file watcher active.

---

## PHASE 4: STORE & SCREEN SYSTEM

### Pydantic Store

```python
from pydantic import BaseModel
from typing import Optional, Callable, List
import threading

class Store:
    def __init__(self):
        self._db: Optional[ScholarStore] = None
        self._loading = False
        self._error: Optional[str] = None
        self._subscribers: List[Callable] = []
    
    def set_db(self, data):
        self._db = ScholarStore(**data)
        self._notify()
    
    def subscribe(self, callback):
        self._subscribers.append(callback)
    
    def _notify(self):
        for cb in self._subscribers:
            cb()
```

### Selectors

```python
def select_by_category(db, category_id):
    return [s for s in db.scholars if s.categoryId == category_id]

def select_by_language(db, lang):
    return [s for s in db.scholars if lang in s.language]

def select_by_country(db, country_id):
    return [s for s in db.scholars if s.countryId == country_id]

def select_search_results(db, query):
    q = query.lower()
    return [s for s in db.scholars 
            if q in s.name.get('en', '').lower() 
            or q in s.name.get('ar', '').lower()]
```

### Tab System

- 4 screens via Textual's `Screen` class
- Keyboard navigation (←→ switch tabs)
- StatusBar shows scholar count, active filters

> **Checkpoint:** Tab switching works, store updates.

---

## PHASE 5-8: SCREENS

### Scholar Grid View

Card-based layout with Unicode graphics:

```
┌──────────────────────────────────────────────────────┐
│  Voices of Truth - Scholar Directory              🔍   │
├──────────────────────────────────────────────────────┤
│ [All] [Quran] [Fiqh] [History] [Thought] [Dawah]     │
├──────────────────────────────────────────────────────┤
│ ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│ │   Avatar   │  │   Avatar   │  │   Avatar   │       │
│ │            │  │            │  │            │       │
│ │ Name (EN)  │  │ Name (EN)  │  │ Name (EN)  │       │
│ │ Name (AR)  │  │ Name (AR)  │  │ Name (AR)  │       │
│ │ Country🏳️  │  │ Country🏳️  │  │ Country🏳️  │       │
│ │ [🌐][📱]   │  │ [🌐][📱]   │  │ [🌐][📱]   │       │
│ └────────────┘  └────────────┘  └────────────┘       │
└──────────────────────────────────────────────────────┘
```

### Filter Panel

Filter by:
- Category (checkboxes)
- Language (multi-select)
- Country (dropdown)
- Search query (text input)

### Category Map

Distribution visualization:
- Bar chart of scholars per category
- Color-coded by discipline

### Language Stats

- Pie chart of languages
- Breakdown by Arabic/English/Bilingual

---

## PHASE 9: DESIGN SYSTEM

### Terminal Colors

| Purpose | Terminal Color |
|---------|---------------|
| Primary (Islam) | green |
| Secondary | blue |
| Accent | cyan |
| Category Quran | yellow |
| Category Fiqh | magenta |
| Category History | white |
| Muted | white |

### CSS

```python
CSS = """
Screen { background: $surface; }
TabBar { width: 50%; }
StatusBar { width: 50%; }
ListView { height: 100%; }
ScholarCard { border: solid $primary; }
"""
```

---

## PHASE 10: DATA INTEGRATION

### Import from Existing Data

The system should import from:
- `src/types/index.ts` — Type definitions
- `src/data/scholars/` — Category-wise scholar arrays
- `public/locales/{en,ar}/*.json` — Translation files

### Workflow

1. Parse existing TypeScript data files
2. Convert to JSON schema
3. Populate `scholars-db.json`
4. Enable real-time sync

---

## POST-BUILD

> The Voices of Truth Command Center skeleton is built. Run the import workflow to hydrate from existing data.

### Import Commands

```bash
voices-of-truth import-scholars --from ./src/data/scholars
voices-of-truth sync-translations --from ./public/locales
voices-of-truth validate-db
```

---

## IMPLEMENTATION QUICK REFERENCE

| Task | Command |
|------|---------|
| Install MCP | `npm install -g voices-of-truth-mcp` |
| Install TUI | `pip install -e voices-of-truth-tui/` |
| Run TUI | `voices-of-truth-tui` |
| List scholars | `voices-of-truth list-scholars` |
| Add scholar | `voices-of-truth add-scholar <name>` |
| Get stats | `voices-of-truth get-statistics` |

---

## PNPM INTEGRATION

This project uses **pnpm** as the package manager (v10.18.3+).

### Workspace Structure

```
voices-of-truth/              # pnpm workspace root
├── package.json              # workspace config
├── pnpm-workspace.yaml       # defines packages/
├── voices-of-truth-mcp/      # MCP Server (Node.js)
├── voices-of-truth-tui/      # TUI App (Python)
└── src/                      # Next.js app (existing)
```

### pnpm Commands for Command Center

```bash
# Install all workspace dependencies
pnpm install

# Add dependency to root or specific package
pnpm --filter voices-of-truth-mcp add @modelcontextprotocol/sdk
pnpm --filter voices-of-truth-tui add textual

# Build MCP server
pnpm --filter voices-of-truth-mcp run build

# Run MCP CLI
pnpm --filter voices-of-truth-mcp run cli -- list-scholars

# Link MCP globally for AI agent access
pnpm --filter voices-of-truth-mcp run global:link

# Install TUI in development mode
pnpm --filter voices-of-truth-tui run dev

# Validate entire workspace
pnpm run lint
pnpm run build
```

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'voices-of-truth-mcp'
  - 'voices-of-truth-tui'
```

### MCP Package Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "cli": "node dist/cli.js",
    "global:link": "npm link -g",
    "test": "vitest"
  }
}
```

### Turbopack Development

The Next.js app uses Turbopack for fast development:

```bash
pnpm dev          # Start with Turbopack
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint check
```

---

## AI AGENT USAGE

### Claude Code Integration

When AI agents need to manage the scholar directory:

```bash
# Start Claude Code with MCP access
claude --mcp voices-of-truth-mcp

# Example agent session
> List all scholars in the Quran Studies category
> Add a new scholar: "Dr. Youssef" from Egypt, Arabic/English
> Search for scholars specializing in Islamic Jurisprudence
> Get statistics on language distribution
```

### MCP Tool Reference for Agents

| Tool | Purpose | Example |
|------|---------|---------|
| `list_scholars` | Browse with filters | `list_scholars --category 5 --lang ar` |
| `get_scholar` | Get details | `get_scholar --id 42` |
| `search_scholars` | Find by name/bio | `search_scholars --query "philosophy"` |
| `add_scholar` | Create new entry | `add_scholar --name "Sheikh X" --country 1` |
| `update_scholar` | Modify entry | `update_scholar --id 42 --bio "Updated..."` |
| `get_statistics` | Directory stats | `get_statistics` |

---

## FILE STRUCTURE REFERENCE

```
voices-of-truth/
├── docs/
│   └── command-center-blueprint-voices-of-truth.md  # This file
├── voices-of-truth-mcp/          # MCP Server package
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── tools.ts
│       ├── schema.ts
│       ├── context.ts
│       └── cli.ts
├── voices-of-truth-tui/           # TUI App package
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── voices_of_truth/
│       ├── __init__.py
│       ├── __main__.py
│       ├── app.py
│       ├── store.py
│       ├── config.py
│       ├── widgets/
│       ├── screens/
│       └── utils/
├── scholars-db.json               # Single source of truth
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # Workspace definition
└── src/                           # Next.js app
```
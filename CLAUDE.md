# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `pnpm dev`
- **Build**: `pnpm build` (runs tsc + vite build)
- **Lint**: `pnpm lint`
- **Type check only**: `npx tsc -b --noEmit`

## Architecture

SentenceLens is a single-page React app that analyzes English sentences via an OpenAI-compatible API and renders the results as color-annotated text and a syntax tree.

### Data flow

1. User enters a sentence in `InputPanel` → calls `App.handleAnalyze`
2. `App` calls `services/ai.ts:analyzeSentence()` which sends a structured prompt to the AI
3. The AI returns an `AnalysisResult` JSON (defined in `types/analysis.ts`) containing tokens, a clause tree, translation, and grammar patterns
4. `App` passes the result to `ColorAnnotation` (flat token view) and `TreeView` (hierarchical clause view)

### API proxy

Browser requests don't go directly to the external API (CORS). Instead, `vite.config.ts` contains a custom Vite server plugin (`apiProxyPlugin`) that intercepts `/api/proxy/*` requests. The frontend sends the real API base URL in an `X-Target-Base` header, and the middleware forwards the request server-side. The `accept-encoding` header is stripped to avoid compressed response issues.

### Key types

All AI response types live in `types/analysis.ts`. The two core structures are:
- `TokenAnnotation`: flat list of words/phrases with POS tag, grammar role, and Chinese meaning
- `ClauseNode`: recursive tree structure for hierarchical sentence decomposition

### Color system

`utils/colors.ts` maps each `GrammarRole` to Tailwind color classes and Chinese labels. Components import `roleColors` for consistent highlighting across `ColorAnnotation` and `TreeView`.

### Settings

API settings (key, base URL, model) are stored in `localStorage` under `sentence-lens-settings`. The `SettingsPanel` component handles load/save via exported `loadSettings`/`saveSettings` helpers.

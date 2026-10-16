# Research & Technical Decisions: Quote of the Day

**Feature**: `001-quote-of-the-day`
**Date**: 2026-10-17
**Status**: Completed

## 1. Architecture & Modularity

### Decision
Use standard native HTML5, modern CSS3 (Custom Properties, Flexbox, CSS Grid), and native browser ES6 modules (`<script type="module">`). Separate code cleanly into:
- `data/`: Built-in quote collection.
- `services/`: Pure business logic (`QuoteService`, `StorageService`).
- `ui/`: DOM controllers and view rendering (`QuoteView`, `FavoritesView`).
- `app.js`: Root orchestrator binding UI events to services.

### Rationale
- **Zero Build Overhead**: Runs immediately by opening `index.html` or serving via any static web server (such as `npx serve` or Python `http.server`).
- **High Testability**: Pure business logic modules in `services/` have no direct DOM dependencies, enabling fast, isolated unit testing under standard automated test runners.
- **Maintainability & Modularity**: Adheres to the Single Responsibility Principle and Constitution Principle I/III (clean architecture, low cognitive load).

### Alternatives Considered
- **Monolithic Single File**: Putting all HTML, CSS, and JS in a single `index.html`. Rejected because it creates tight coupling, prevents isolated unit testing, and violates Constitution Principle I.
- **Frontend Frameworks (React/Vue/Svelte)**: Rejected per explicit user constraint ("Use plain HTML/CSS/JavaScript, no backend").

---

## 2. Persistence & Storage Strategy

### Decision
Use browser `window.localStorage` to store user favorites, wrapped within a dedicated `StorageService` that provides graceful degradation to in-memory storage if `localStorage` is disabled, inaccessible (e.g. strict privacy modes, incognito restrictions), or full.

### Rationale
- **User Requirement**: Explicitly requested `localStorage`.
- **Key Schema**: Store under the namespaced key `qod_favorites_v1`.
- **Fault Tolerance**: Wrapping access in `try / catch` blocks catches `SecurityError` and `QuotaExceededError`. When storage fails, the service falls back to in-memory state and triggers a non-intrusive UI notification (satisfying FR-013).

### Alternatives Considered
- **IndexedDB**: Asynchronous and capable of larger datasets, but adds unnecessary complexity and asynchronous ceremony for storing a small list of quote IDs.
- **Cookies**: Inefficient and transmitted with every HTTP request; unnecessary for client-only offline state.
- **In-Memory Only**: Fails the requirement for persistence across reloads.

---

## 3. Quote Selection & Consecutive Repeat Prevention

### Decision
Implement `QuoteService.getRandomQuote(excludeId)` which selects a quote from the curated collection. If the collection contains 2 or more items and a quote is currently active, the service filters out the active quote or recalculates an offset to guarantee that the next quote is never the same as the current quote.

### Rationale
- Satisfies FR-005 and Acceptance Scenario 2 of User Story 2.
- Handles edge cases cleanly: if collection size is 1, returns the single quote without crashing or infinite looping.

### Alternatives Considered
- **Random selection without exclusion**: Can result in the same quote being selected twice consecutively, producing poor user feedback when clicking "New quote".
- **Full Fisher-Yates Deck Shuffling**: Shuffles the whole array in advance. Slightly more complex state to track; tracking `excludeId` or `lastQuoteId` is cleaner and stateless.

---

## 4. Favorites Data Representation

### Decision
Store an array of lightweight record objects containing `quoteId` and `favoritedAt` ISO timestamp:
```json
[
  { "quoteId": "quote-001", "favoritedAt": "2026-10-17T02:15:00.000Z" }
]
```
At runtime, maintain a `Set<string>` of active favorite IDs for $O(1)$ lookup when rendering the active quote's favorite toggle state.

### Rationale
- Avoids duplicating quote text in storage; if quotes are enriched or formatted, storage data remains valid.
- Storing `favoritedAt` enables chronological sorting of favorites in the favorites list.

### Alternatives Considered
- **Storing Full Quote Objects**: Redundant data duplication in `localStorage`, risk of stale quotes if built-in list is updated.
- **Storing IDs as comma-separated string**: Fragile parsing compared to JSON array.

---

## 5. Accessibility & Responsive UX

### Decision
- **Semantic HTML**: `<main>`, `<article class="quote-card">`, `<blockquote>`, `<cite>`, and accessible `<button>` controls.
- **Screen Reader Announcements**: Use `aria-live="polite"` on the quote container so assistive technologies announce new quotes upon clicking "New quote".
- **Accessible Toggle**: Use `aria-pressed="true|false"` and descriptive `aria-label` (e.g., "Add quote to favorites" / "Remove quote from favorites").
- **Responsive Typography**: Fluid typography using CSS `clamp()` and modern system font stacks for fast load times and clean reading across all viewports from 320px to 4K displays.

### Rationale
- Satisfies WCAG 2.1 AA requirements and Success Criteria SC-004 & SC-005.

---

## 6. Testing Strategy

### Decision
- **Unit Tests**: Test `QuoteService` and `StorageService` using Node's built-in `node:test` and `node:assert` modules. Zero external npm dependencies required for running test suites.
- **Integration Tests**: Mock `localStorage` and verify end-to-end interactions (quote cycling, favorite toggling, persistence lifecycle).
- **Manual Verification**: Run headless or in-browser verification following `quickstart.md`.

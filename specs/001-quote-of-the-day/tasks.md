# Tasks: Quote of the Day

**Feature**: `001-quote-of-the-day` | **Date**: 2026-10-17 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic directory structure

- [X] T001 Create project directory structure (`src/`, `src/css/`, `src/js/`, `src/js/data/`, `src/js/services/`, `src/js/ui/`, `tests/unit/`, `tests/integration/`) per implementation plan
- [X] T002 [P] Create `package.json` with `"type": "module"` and `"test": "node --test tests/**/*.test.js"` in repository root
- [X] T003 [P] Create base CSS tokens, CSS reset, and responsive layout grid in `src/css/styles.css`
- [X] T004 [P] Create UI component styling (quote card, buttons, drawer, accessibility focus indicators) in `src/css/components.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and domain services that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create curated quote dataset with at least 25 diverse quotes in `src/js/data/quotes.js` satisfying verbatim constraints: `id` "non-empty, alphanumeric with dashes (e.g. quote-001)", `text` "non-empty string, trimmed", `author` "non-empty string", and optional `category`
- [X] T006 [P] Create unit test suite for StorageService in `tests/unit/storage.test.js` covering `getFavorites`, `addFavorite`, `removeFavorite`, `isFavorite`, corrupted JSON fallback, and in-memory fallback
- [X] T007 Implement `StorageService` in `src/js/services/storage.js` implementing [storage.contract.md](contracts/storage.contract.md) with `localStorage` key `qod_favorites_v1` and in-memory fallback
- [X] T008 [P] Create unit test suite for QuoteService in `tests/unit/quote-service.test.js` covering `getRandomQuote`, `getQuoteById`, `getAllQuotes`, and single-quote edge cases
- [X] T009 Implement `QuoteService` in `src/js/services/quote-service.js` implementing [quote-service.contract.md](contracts/quote-service.contract.md) for random quote selection and quote lookup

**Checkpoint**: Foundation ready - all core services and data layers are complete and tested.

---

## Phase 3: User Story 1 - Viewing a Random Quote on Page Load (Priority: P1) 🎯 MVP

**Goal**: When a visitor opens the page, an inspirational quote with author attribution is selected randomly from the built-in collection and visibly displayed immediately.

**Independent Test**: Open `src/index.html` in browser; a complete quote containing non-empty text and attributed author is displayed within 1 second.

### Tests for User Story 1 🧪
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Create integration test for initial page load and quote rendering in `tests/integration/quote-view.test.js`

### Implementation for User Story 1

- [X] T011 [P] [US1] Create semantic HTML5 document structure with `#quote-container`, `#quote-text`, and `#quote-author` in `src/index.html`
- [X] T012 [US1] Implement `QuoteView` component in `src/js/ui/quote-view.js` to render quote text, author attribution, and manage `aria-live="polite"`
- [X] T013 [US1] Implement initial page bootstrap in `src/js/app.js` integrating `QuoteService` and `QuoteView` to display a random quote on load

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 - Generating a New Random Quote (Priority: P2)

**Goal**: When a user clicks the "New quote" button, a different quote from the collection is displayed immediately without full page reload or consecutive repeats.

**Independent Test**: Click "New quote" button; verify quote text and author immediately update to a different quote from the collection.

### Tests for User Story 2 🧪

- [X] T014 [P] [US2] Add unit tests in `tests/unit/quote-service.test.js` verifying `getRandomQuote(excludeId)` never returns `excludeId` when collection size $\ge 2$

### Implementation for User Story 2

- [X] T015 [US2] Update `QuoteService` in `src/js/services/quote-service.js` to enforce repeat prevention when `excludeId` is provided
- [X] T016 [P] [US2] Add accessible "New quote" button `#new-quote-btn` with `aria-label="Show new quote"` in `src/index.html`
- [X] T017 [US2] Bind "New quote" button click handler in `src/js/app.js` to fetch a distinct random quote and update `QuoteView`

**Checkpoint**: User Stories 1 and 2 work independently and seamlessly together.

---

## Phase 5: User Story 3 - Favoriting Quotes with Persistent Storage (Priority: P3)

**Goal**: User can toggle favorite status on any displayed quote; favorite state persists across page reloads and browser restarts in `localStorage`.

**Independent Test**: Mark a quote as favorited, reload the page/cycle quotes, confirm that quote retains its favorited state (`aria-pressed="true"`), and toggling again clears it.

### Tests for User Story 3 🧪

- [X] T018 [P] [US3] Create integration tests for favorite toggle and persistence lifecycle in `tests/integration/favorite-toggle.test.js`

### Implementation for User Story 3

- [X] T019 [P] [US3] Add favorite toggle button `#favorite-toggle-btn` with `aria-pressed="false"` inside `#quote-container` in `src/index.html`
- [X] T020 [US3] Update `QuoteView` in `src/js/ui/quote-view.js` to reflect active/inactive favorite icon state and update `aria-pressed`
- [X] T021 [US3] Wire favorite button click handler in `src/js/app.js` to toggle state in `StorageService` and update `QuoteView`
- [X] T022 [US3] Add storage fallback warning element `#storage-warning` in `src/index.html` and trigger display in `src/js/app.js` when `storage.isPersistent() === false`

**Checkpoint**: User Stories 1, 2, and 3 are functional with full persistence.

---

## Phase 6: User Story 4 - Browsing Saved Favorite Quotes (Priority: P4)

**Goal**: User can open a dedicated favorites drawer/panel to view all saved favorite quotes and remove quotes directly from the list.

**Independent Test**: Favorite several quotes, open favorites drawer, confirm all favorited quotes appear with text and author, and clicking remove deletes the quote from favorites.

### Tests for User Story 4 🧪

- [X] T023 [P] [US4] Create unit and DOM tests for favorites drawer rendering and removal actions in `tests/unit/favorites-view.test.js`

### Implementation for User Story 4

- [X] T024 [P] [US4] Add favorites drawer container `#favorites-drawer`, drawer toggle button `#toggle-favorites-btn`, and `#favorites-list` in `src/index.html`
- [X] T025 [US4] Implement `FavoritesView` in `src/js/ui/favorites-view.js` to render favorites list, empty state message, and item removal controls
- [X] T026 [US4] Wire favorites drawer toggle and item removal events in `src/js/app.js` updating `StorageService` and refreshing active quote favorite state

**Checkpoint**: All user stories (P1 through P4) are fully implemented and functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality hardening, accessibility verification, and final validation

- [X] T027 [P] Execute full automated test suite `node --test tests/**/*.test.js` and verify 100% passing rate
- [X] T028 [P] Audit WCAG 2.1 AA accessibility (color contrast $\ge 4.5:1$, keyboard navigation, focus outlines, ARIA labels) across `src/index.html` and `src/css/`
- [X] T029 Execute full end-to-end manual verification against scenarios in `specs/001-quote-of-the-day/quickstart.md`
- [X] T030 [P] Create `README.md` in repository root documenting architecture, usage instructions, and test commands

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - **BLOCKS all user stories**.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion. Delivers working MVP.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and integrates with US1 UI.
- **User Story 3 (Phase 5)**: Depends on Phase 2 and integrates with US1/US2 UI.
- **User Story 4 (Phase 6)**: Depends on Phase 2 and integrates with US3 favorites storage.
- **Polish (Phase 7)**: Depends on completion of all user stories.

### User Story Dependencies

```
[Phase 1: Setup]
       │
       ▼
[Phase 2: Foundational (Quotes Data & Core Services)]
       │
       ├─────────────────────────────────────────┐
       ▼                                         ▼
[Phase 3: US1 - Quote on Load (MVP)]      [Phase 4: US2 - New Quote Button]
       │                                         │
       └────────────────────┬────────────────────┘
                            │
                            ▼
              [Phase 5: US3 - Persistent Favoriting]
                            │
                            ▼
              [Phase 6: US4 - Saved Favorites Drawer]
                            │
                            ▼
              [Phase 7: Polish & Verification]
```

### Within Each User Story
1. Tests written first (red phase) and verified failing.
2. Markup and view components developed.
3. Event coordination wired in `app.js`.
4. Tests verified passing (green phase).

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can be implemented in parallel after T001.
- **Phase 2**: T006 (storage tests) and T008 (quote service tests) can be written in parallel.
- **Phase 3**: T010 (tests) and T011 (HTML structure) can be written in parallel.
- **Phase 4**: T014 (tests) and T016 (button markup) can be written in parallel.
- **Phase 5**: T018 (tests) and T019 (toggle markup) can be written in parallel.
- **Phase 6**: T023 (tests) and T024 (drawer markup) can be written in parallel.
- **Phase 7**: T027, T028, and T030 can run in parallel.

---

## Parallel Example: User Story 3

```bash
# Launch test task and markup task concurrently:
Task 1: "T018 [P] [US3] Create integration tests for favorite toggle and persistence lifecycle in tests/integration/favorite-toggle.test.js"
Task 2: "T019 [P] [US3] Add favorite toggle button #favorite-toggle-btn with aria-pressed="false" inside #quote-container in src/index.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational data & services).
2. Complete Phase 3 (User Story 1 - Quote on Load).
3. **STOP and VALIDATE**: Verify page loads an inspiring quote immediately without errors.

### Incremental Delivery
1. Foundation Ready: Quotes dataset and domain services tested and verified.
2. Deliver US1 (MVP): Page displays random quote.
3. Deliver US2: Add "New quote" on-demand cycling with consecutive repeat prevention.
4. Deliver US3: Add favoriting toggle with `localStorage` persistence.
5. Deliver US4: Add favorites drawer to inspect and remove saved favorites.
6. Polish & Verify: Run automated tests, accessibility audit, and quickstart scenarios.

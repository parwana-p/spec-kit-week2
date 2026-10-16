# Quickstart & Verification Guide: Quote of the Day

**Feature**: `001-quote-of-the-day`
**Date**: 2026-10-17

This guide provides step-by-step instructions for running automated tests and manually verifying all user scenarios end-to-end.

## Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge).
- Node.js (v18+ recommended) for running the zero-dependency automated unit/contract test suite via `node --test`.

---

## 1. Running Automated Tests

Run the unit and contract test suites from the repository root:

```bash
# Run all automated tests using Node's built-in test runner
node --test tests/**/*.test.js
```

### Expected Test Suite Outcomes:
1. `QuoteService` suite:
   - Verifies random selection returns valid quote.
   - Verifies `getRandomQuote(excludeId)` never returns `excludeId` when collection size $\ge 2$.
   - Handles single-item collection without infinite loops.
2. `StorageService` suite:
   - Verifies saving, retrieving, and removing favorites.
   - Verifies handling of corrupted JSON without crashing.
   - Verifies seamless fallback to in-memory store when `localStorage` throws errors.

---

## 2. Launching the Application

Because this is a zero-build client-side application, you can run it via any local static server:

```bash
# Option A: Using Python (built-in)
python -m http.server 8080

# Option B: Using Node npx serve
npx serve src -p 8080
```
Open `http://localhost:8080` in your web browser.

---

## 3. Manual Scenario Validation

### Scenario 1: Initial Page Load (User Story 1, P1)
1. Open `http://localhost:8080`.
2. **Verify**: A quote card is visibly rendered in under 1 second containing:
   - Non-empty quote text inside quotation marks.
   - Author name prefixed with attribution formatting (e.g. `— Maya Angelou`).
   - A favorite icon button (unfilled/unpressed by default if not favorited).
   - A "New quote" button.

### Scenario 2: Generate New Quote (User Story 2, P2)
1. Note the currently displayed quote.
2. Click the "New quote" button.
3. **Verify**: The quote text and author update immediately without full page reload.
4. **Verify**: The newly displayed quote is different from the quote displayed immediately before.

### Scenario 3: Favoriting Across Reloads (User Story 3, P3)
1. On the currently displayed quote, click the favorite toggle button (heart icon).
2. **Verify**: The button fills with an active color, and `aria-pressed` transitions to `true`.
3. Press `F5` / Refresh the browser page.
4. If a different quote loads, click "New quote" until the previously favorited quote is displayed (or check the favorites drawer).
5. **Verify**: When that quote is displayed, its favorite toggle button remains filled (`aria-pressed="true"`).
6. Click the favorite toggle again.
7. **Verify**: The favorite indicator becomes unpressed/outlined.
8. Refresh the page again; verify the quote is no longer marked as favorite.

### Scenario 4: Browsing Saved Favorites Drawer (User Story 4, P4)
1. Favorite 2 or 3 distinct quotes.
2. Click the "Saved Favorites" button in the header.
3. **Verify**: A side drawer or panel opens displaying the favorited quotes with their text and author.
4. Click the "Remove" (trash / X) button next to one quote in the list.
5. **Verify**: That quote is immediately removed from the favorites drawer and deleted from storage.

### Scenario 5: Storage Degradation / Privacy Mode (Edge Case)
1. Open the page in a browser with `localStorage` disabled or in an iframe with storage blocked.
2. **Verify**: The application continues to cycle quotes and supports favoriting during the session without throwing uncaught exceptions.
3. **Verify**: A subtle notification indicates that favorites will not persist across browser restarts due to disabled storage.

# Data Model: Quote of the Day

**Feature**: `001-quote-of-the-day`
**Date**: 2026-10-17
**Status**: Completed

## 1. Entities

### Quote
Represents an individual curated quote loaded from the built-in library.

| Field | Type | Required | Description | Constraints |
|---|---|---|---|---|
| `id` | `string` | Yes | Unique identifier for the quote | Non-empty, alphanumeric with dashes (e.g., `"quote-001"`) |
| `text` | `string` | Yes | The verbatim text of the quotation | Non-empty string, trimmed |
| `author` | `string` | Yes | Name of the author or attribution | Non-empty string (e.g., `"Maya Angelou"`, `"Marcus Aurelius"`) |
| `category` | `string` | No | Optional thematic classification | e.g., `"Resilience"`, `"Philosophy"`, `"Creativity"` |

#### Example Quote Object:
```json
{
  "id": "quote-001",
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "category": "Work & Passion"
}
```

---

### FavoriteRecord
Represents the persistent association indicating that a user has favorited a specific quote.

| Field | Type | Required | Description | Constraints |
|---|---|---|---|---|
| `quoteId` | `string` | Yes | Identifier referencing `Quote.id` | Must match an existing quote identifier |
| `favoritedAt` | `string` | Yes | ISO 8601 timestamp when favorited | Valid ISO string (e.g., `"2026-10-17T02:15:00.000Z"`) |

#### Example Storage Record:
```json
{
  "quoteId": "quote-001",
  "favoritedAt": "2026-10-17T02:15:00.000Z"
}
```

---

## 2. Storage Schema

### LocalStorage Schema
- **Key**: `qod_favorites_v1`
- **Value**: JSON-serialized array of `FavoriteRecord` objects.

```json
[
  {
    "quoteId": "quote-003",
    "favoritedAt": "2026-10-17T02:10:00.000Z"
  },
  {
    "quoteId": "quote-012",
    "favoritedAt": "2026-10-17T02:12:30.000Z"
  }
]
```

### In-Memory Fallback Schema
When `localStorage` is blocked or unavailable:
```javascript
class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) { return this.store.get(key) || null; }
  setItem(key, val) { this.store.set(key, String(val)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}
```

---

## 3. State Transitions & Invariants

```
                +-------------------+
                |   Page Initial    |
                |       Load        |
                +---------+---------+
                          |
                          v
                +-------------------+
                | Display Random    |
                |   Quote (Q1)      |
                +---------+---------+
                          |
          +---------------+---------------+
          |                               |
    [Click New Quote]             [Toggle Favorite]
          |                               |
          v                               v
+-------------------+           +-------------------+
| Display New Quote |           | If Q1 in Favorites|
| Q2 (where Q2!=Q1) |           |   -> Remove Q1    |
+-------------------+           | Else              |
                                |   -> Add Q1       |
                                +-------------------+
```

### Invariants:
1. **No Consecutive Duplicate**: If quote collection size $N \ge 2$, `nextQuote.id !== currentQuote.id`.
2. **Idempotent Favoriting**: Adding an already-favorited quote ID does not create duplicates. Removing a non-existent favorite ID is a safe no-op.
3. **Data Integrity on Parse Failure**: If `localStorage.getItem("qod_favorites_v1")` returns malformed JSON, the parser resets the key to `[]` without throwing an unhandled runtime error.

# Contract: QuoteService

**Path**: `src/js/services/quote-service.js`
**Interface Type**: Pure Domain Service

## Class: `QuoteService`

### `constructor(quotes: Quote[])`
Initializes the service with a collection of quotes.
- **Parameters**:
  - `quotes`: Array of `Quote` objects (`Quote[]`).
- **Preconditions**:
  - `quotes` must be a non-empty array (`quotes.length > 0`). Each element must have valid `id`, `text`, and `author`.
- **Throws**:
  - `TypeError` if `quotes` is not an array or is empty.

---

### `getRandomQuote(excludeId?: string): Quote`
Returns a randomly selected quote from the collection.
- **Parameters**:
  - `excludeId` *(optional, string)*: An ID of a quote to exclude from selection (e.g., currently displayed quote).
- **Behavior**:
  - If `quotes.length === 1`, returns the single quote regardless of `excludeId`.
  - If `quotes.length > 1` and `excludeId` is provided, selects uniformly at random from quotes whose `id !== excludeId`.
- **Returns**: `Quote`
- **Postconditions**:
  - Returned object is guaranteed to be a valid `Quote`.
  - If `quotes.length > 1` and `excludeId` matches a quote, `returnedQuote.id !== excludeId`.

---

### `getQuoteById(id: string): Quote | undefined`
Finds a quote by its unique ID.
- **Parameters**:
  - `id` *(string)*: Unique identifier.
- **Returns**: `Quote | undefined`

---

### `getAllQuotes(): Quote[]`
Returns a shallow copy of all quotes in the collection.
- **Returns**: `Quote[]`

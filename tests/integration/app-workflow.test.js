import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { QuoteService } from "../../src/js/services/quote-service.js";
import { StorageService } from "../../src/js/services/storage.js";
import { quotes } from "../../src/js/data/quotes.js";

class MockStorage {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.get(key) || null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

describe("End-to-End Workflow Verification (Quickstart Scenarios)", () => {
  test("Scenario 1 & 2: Initial Load and New Quote Cycling without immediate repeats", () => {
    const quoteService = new QuoteService(quotes);
    const firstQuote = quoteService.getRandomQuote();
    assert.ok(firstQuote.id);
    assert.ok(firstQuote.text.length > 0);
    assert.ok(firstQuote.author.length > 0);

    const secondQuote = quoteService.getRandomQuote(firstQuote.id);
    assert.notEqual(secondQuote.id, firstQuote.id, "Second quote must not match first quote");
  });

  test("Scenario 3 & 4: Favoriting, Persistence across reload, and Drawer Removal", () => {
    const mockStorageBackend = new MockStorage();
    let storageService = new StorageService(mockStorageBackend);
    const quoteService = new QuoteService(quotes);

    // Step 1: User favorites quote 1
    const targetQuote = quotes[0];
    storageService.addFavorite(targetQuote.id);
    assert.equal(storageService.isFavorite(targetQuote.id), true);

    // Step 2: Simulate browser page reload by creating a new StorageService instance with same backend
    const reloadedStorage = new StorageService(mockStorageBackend);
    assert.equal(reloadedStorage.isFavorite(targetQuote.id), true, "Favorite must persist across reload");

    // Step 3: View favorites list
    const favRecords = reloadedStorage.getFavorites();
    assert.equal(favRecords.length, 1);
    assert.equal(favRecords[0].quoteId, targetQuote.id);

    // Step 4: Remove favorite
    reloadedStorage.removeFavorite(targetQuote.id);
    assert.equal(reloadedStorage.isFavorite(targetQuote.id), false, "Favorite removed");
    assert.equal(reloadedStorage.getFavorites().length, 0);
  });
});

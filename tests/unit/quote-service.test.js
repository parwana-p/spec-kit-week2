import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { QuoteService } from "../../src/js/services/quote-service.js";

const sampleQuotes = [
  { id: "quote-1", text: "Quote One", author: "Author One", category: "Test" },
  { id: "quote-2", text: "Quote Two", author: "Author Two", category: "Test" },
  { id: "quote-3", text: "Quote Three", author: "Author Three", category: "Test" }
];

describe("QuoteService", () => {
  test("should throw TypeError if quotes array is empty or invalid", () => {
    assert.throws(() => new QuoteService([]), /TypeError/);
    assert.throws(() => new QuoteService(null), /TypeError/);
  });

  test("should return all quotes with getAllQuotes()", () => {
    const service = new QuoteService(sampleQuotes);
    const all = service.getAllQuotes();
    assert.equal(all.length, 3);
    assert.deepEqual(all, sampleQuotes);
  });

  test("should find quote by id with getQuoteById()", () => {
    const service = new QuoteService(sampleQuotes);
    const found = service.getQuoteById("quote-2");
    assert.ok(found);
    assert.equal(found.id, "quote-2");
    assert.equal(found.text, "Quote Two");

    const notFound = service.getQuoteById("non-existent");
    assert.equal(notFound, undefined);
  });

  test("should return a random quote from the collection", () => {
    const service = new QuoteService(sampleQuotes);
    const randomQuote = service.getRandomQuote();
    assert.ok(randomQuote);
    assert.ok(["quote-1", "quote-2", "quote-3"].includes(randomQuote.id));
  });

  test("should handle single quote collection gracefully", () => {
    const singleQuote = [{ id: "single", text: "Only One", author: "Solo" }];
    const service = new QuoteService(singleQuote);

    const quote = service.getRandomQuote("single");
    assert.ok(quote);
    assert.equal(quote.id, "single");
  });

  test("should never return excludeId when collection size >= 2", () => {
    const service = new QuoteService(sampleQuotes);

    // Test multiple iterations to ensure randomness never selects excludeId
    for (let i = 0; i < 50; i++) {
      const quote = service.getRandomQuote("quote-1");
      assert.notEqual(quote.id, "quote-1", `Iteration ${i} returned excluded ID quote-1`);
      assert.ok(["quote-2", "quote-3"].includes(quote.id));
    }
  });
});

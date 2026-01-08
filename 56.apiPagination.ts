/**
 * Some APIs use pagination, requiring recursive fetching based on previous responses.
 *
 * Suppose we have a `/list` API that returns an array of items:
 *
 * // fetchList is provided for you
 * const fetchList = (since?: number) => Promise<{ items: Array<{ id: number }> }>
 *
 * For the initial request, call fetchList(). Get the last item's id from the response.
 * For the next page, call fetchList(lastItemId).
 * Repeat this process.
 *
 * The `/list` API only returns up to 5 items at a time. With server-side filtering, it might be less than 5.
 * If no items are returned, there is nothing more to fetch and we should stop.
 *
 * You are asked to create a function that can return an arbitrary amount of items:
 *
 * const fetchListWithAmount = (amount: number = 5) { }
 *
 * Note:
 * - You can use a regular loop, or fancier solutions like async iterators or async generators.
 * - Try implementing them all.
 */

// 1. Recursion with Promise
const fetchListWithAmountRecursive = (amount: number = 5) => {
    const results: Array<{ id: number }> = [];

    const fetchMore = (since?: number): Promise<Array<{ id: number }>> => {
        return fetchList(since).then(({ items }) => {
            if (!items.length || results.length >= amount) {
                return results.slice(0, amount);
            }
            results.push(...items);
            return fetchMore(items[items.length - 1].id);
        });
    };

    return fetchMore();
};

// 2. Async/Await
const fetchListWithAmountAsync = async (amount: number = 5) => {
    const results: Array<{ id: number }> = [];
    let since: number | undefined;

    while (results.length < amount) {
        const { items } = await fetchList(since);
        if (!items.length) break;

        results.push(...items);
        since = items[items.length - 1].id;
    }

    return results.slice(0, amount);
};

// 3. Generator
async function* fetchListGenerator() {
    let since: number | undefined;

    while (true) {
        const { items } = await fetchList(since);
        if (!items.length) break;

        for (const item of items) {
            yield item;
        }
        since = items[items.length - 1].id;
    }
}

const fetchListWithAmountGenerator = async (amount: number = 5) => {
    const results: Array<{ id: number }> = [];
    const generator = fetchListGenerator();

    for await (const item of generator) {
        results.push(item);
        if (results.length >= amount) break;
    }

    return results;
};

// 4. Async Iterator
const fetchListIterator = {
    since: undefined as number | undefined,
    async next() {
        const { items } = await fetchList(this.since);
        if (!items.length) return { done: true, value: undefined };

        this.since = items[items.length - 1].id;
        return { done: false, value: items };
    },
    [Symbol.asyncIterator]() {
        return this;
    },
};

const fetchListWithAmountIterator = async (amount: number = 5) => {
    const results: Array<{ id: number }> = [];
    const iterator = { ...fetchListIterator }; // Create new instance

    for await (const items of iterator) {
        results.push(...items);
        if (results.length >= amount) break;
    }

    return results.slice(0, amount);
};

// 5. Regular Loop with Promises
const fetchListWithAmountLoop = (amount: number = 5) => {
    const results: Array<{ id: number }> = [];
    let since: number | undefined;

    return new Promise<Array<{ id: number }>>(async (resolve) => {
        while (true) {
            const { items } = await fetchList(since);
            if (!items.length || results.length >= amount) {
                resolve(results.slice(0, amount));
                break;
            }
            results.push(...items);
            since = items[items.length - 1].id;
        }
    });
};

// Export all implementations
export {
    fetchListWithAmountRecursive,
    fetchListWithAmountAsync,
    fetchListWithAmountGenerator,
    fetchListWithAmountIterator,
    fetchListWithAmountLoop,
};

// fetchList is provided for you
const fetchList = (since?: number) => Promise<{ items: Array<{ id: number }> }>;
const fetchListWithAmount = (amount: number = 5) { }
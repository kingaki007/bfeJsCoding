/**
 * Browser History Implementation
 *
 * Simulates common browser history actions:
 *
 * - new BrowserHistory() - Creates new tab with empty history
 * - goBack() - Navigate to previous entry (keeps entries for forward)
 * - forward() - Navigate to next entry
 * - visit() - Add new entry and truncate forward history
 *
 * Example:
 * 1. Start with empty history: [ ]
 * 2. Visit A, B, C: [ A, B, C] (cursor at C)
 * 3. Go back to B: [ A, B, C] (cursor at B)
 * 4. Go back to A: [ A, B, C] (cursor at A)
 * 5. Forward to B: [ A, B, C] (cursor at B)
 * 6. Visit D: [ A, B, D] (C is truncated)
 */

class BrowserHistory {
    private history: string[] = [];
    private cursor: number = -1;

    constructor() {
        // Start with empty history
        this.history = [];
        this.cursor = -1;
    }

    /**
     * Visits a new URL and truncates forward history
     * @param url The URL to visit
     */
    visit(url: string): void {
        // Remove all entries after current cursor
        this.history = this.history.slice(0, this.cursor + 1);
        // Add new URL and move cursor
        this.history.push(url);
        this.cursor++;
    }

    /**
     * Navigate back in history
     * @returns The previous URL or null if at the start
     */
    goBack(): string | null {
        if (this.cursor <= 0) {
            this.cursor = -1;
            return null;
        }
        this.cursor--;
        return this.history[this.cursor];
    }

    /**
     * Navigate forward in history
     * @returns The next URL or null if at the end
     */
    forward(): string | null {
        if (this.cursor >= this.history.length - 1) {
            return null;
        }
        this.cursor++;
        return this.history[this.cursor];
    }

    /**
     * Get current state of history for testing/debugging
     */
    getCurrentState(): { history: string[]; cursor: number } {
        return {
            history: [...this.history],
            cursor: this.cursor,
        };
    }
}

class MyBrowserHistory {
    history: never[];
    currentIndex: number;
    /**
     * @param {string} url
     * if url is set, it means new tab with url
     * otherwise, it is empty new tab
     */
    constructor(url) {
        this.history = [];
        this.currentIndex = 0;
        if (url) {
            this.history.push(url);
        }
    }
    /**
     * @param { string } url
     */
    visit(url) {
        this.history.length = this.currentIndex + 1;
        this.history.push(url);
        this.currentIndex += 1;
    }

    /**
     * @return {string} current url
     */
    get current() {
        return this.history[this.currentIndex];
    }

    // go to previous entry
    goBack() {
        this.currentIndex = Math.max(0, --this.currentIndex);
    }

    // go to next visited url
    forward() {
        this.currentIndex = Math.min(
            this.history.length - 1,
            ++this.currentIndex
        );
    }
}

export default BrowserHistory;

// Example usage:
const history = new MyBrowserHistory("");
history.visit("A"); // ['A'], cursor: 0
console.log(history.current);
history.visit("B"); // ['A', 'B'], cursor: 1
console.log(history.current);
history.visit("C"); // ['A', 'B', 'C'], cursor: 2
console.log(history.current);
history.goBack(); // ['A', 'B', 'C'], cursor: 1, returns 'B'
console.log(history.current);
history.goBack(); // ['A', 'B', 'C'], cursor: 0, returns 'A'
console.log(history.current);
history.forward(); // ['A', 'B', 'C'], cursor: 1, returns 'B'
console.log(history.current);
history.visit("D"); // ['A', 'B', 'D'], cursor: 2

console.log(history.current);

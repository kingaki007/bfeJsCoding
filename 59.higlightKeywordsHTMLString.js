/**
 * Suppose you are implementing an auto-complete in search input.

When keywords are typed, you need to highlight the keywords, how would you do that?

To simplify things, you need to create a function highlightKeywords(html:string, keywords: string[]), which wraps the keywords in html string, with <em> tag.

Here is an example.

highlightKeywords(
  'Hello FrontEnd Lovers', 
  ['Hello', 'Front', 'JavaScript']
)
// '<em>Hello</em> <em>Front</em>End Lovers'
Pay attention to the overlapping and adjacent case. You should use the least tags as possible.

highlightKeywords(
  'Hello FrontEnd Lovers', 
  ['Front', 'End', 'JavaScript']
)
// 'Hello <em>FrontEnd</em> Lovers'
highlightKeywords(
  'Hello FrontEnd Lovers', 
  ['Front', 'FrontEnd', 'JavaScript']
)
// 'Hello <em>FrontEnd</em> Lovers'
note that space should not be included.
 */

// This is a JavaScript coding question from BFE.dev
/**
 * @param {string} html
 * @param {string[]} keywords
 */
function highlightKeywords(html, keywords) {
    if (!html || !Array.isArray(keywords) || keywords.length === 0) {
        return html;
    }

    // Filter out empty/whitespace-only keywords and dedupe
    const filtered = Array.from(
        new Set(
            keywords
                .filter((k) => typeof k === "string")
                .map((k) => k.trim())
                .filter((k) => k.length > 0)
        )
    );

    if (filtered.length === 0) {
        return html;
    }

    // Collect all match intervals [start, end)
    const intervals = [];
    for (const kw of filtered) {
        let from = 0;
        while (from <= html.length - kw.length) {
            const idx = html.indexOf(kw, from);
            if (idx === -1) break;
            intervals.push([idx, idx + kw.length]);
            // Move by 1 to allow overlapping matches
            from = idx + 1;
        }
    }

    if (intervals.length === 0) {
        return html;
    }

    // Merge overlapping and adjacent intervals to minimize tags
    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    const merged = [];
    let [curStart, curEnd] = intervals[0];
    for (let i = 1; i < intervals.length; i++) {
        const [s, e] = intervals[i];
        if (s <= curEnd) {
            // overlap or adjacent (s == curEnd) -> merge
            curEnd = Math.max(curEnd, e);
        } else {
            merged.push([curStart, curEnd]);
            [curStart, curEnd] = [s, e];
        }
    }
    merged.push([curStart, curEnd]);

    // Build result string with <em> wrappers
    let res = "";
    let prev = 0;
    for (const [s, e] of merged) {
        if (prev < s) res += html.slice(prev, s);
        res += "<em>" + html.slice(s, e) + "</em>";
        prev = e;
    }
    if (prev < html.length) res += html.slice(prev);

    return res;
}

function highlightKeywords1(html, keywords) {
    // your code here
    const regexp = new RegExp(keywords.join("|"), "gi");
    return html
        .split(" ")
        .map((word) => {
            if (keywords.includes(word)) return `<em>${word}</em>`;
            return word
                .replace(regexp, (w) => `<em>${w}</em>`)
                .replace("</em><em>", "");
        })
        .join(" ");
}

function highlightKeywords2(html, keywords) {
    let bold = new Array(html.length + 1);

    keywords.forEach((w) => {
        let start = html.indexOf(w, 0);
        // until you keep getting valid pattern mark bold array true at those spots
        while (start != -1) {
            bold.fill(true, start, start + w.length);
            start = html.indexOf(w, start + 1);
        }
    });

    let res = bold[0] ? "<em>" : "";

    for (let i = 0; i < bold.length - 1; i++) {
        res += html.charAt(i);

        // notbold && bold we start new tag
        if (!bold[i] && bold[i + 1]) res += "<em>";
        // bold && notbold we end current tag
        else if (bold[i] && !bold[i + 1]) res += "</em>";
    }
    return res;
}

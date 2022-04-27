// Expect the page to hand us all the data in `SEARCH_DATA`:
/** @typedef {Record<string, Emoji>} SEARCH_DATA */

/**
 * Represents a single emoji.
 *
 * @typedef {{title: string, svgUrl: string, pngUrl: string, detailsUrl: string}} Emoji
 */

/**
 * Emoji tiles DOM element.
 *
 * @type {HTMLDivElement}
 */
let emojiTiles;

/**
 * Search for emoji.
 *
 * @param {string | undefined} [query] the query to search for
 * @returns {[Emoji]} the matching emoji
 */
function emojiList(query) {
    if (!query) {
        return Object.values(SEARCH_DATA);
    }
    const results = [];
    const queryLower = query.toLowerCase();
    for (const emoji of Object.values(SEARCH_DATA)) {
        if (emoji.title.toLowerCase().includes(queryLower)) {
            results.push(emoji);
        }
    }
    return results;
}

/**
 * Search for emoji, and update the DOM with the results.
 *
 * @param {string | undefined} [query] the query to search for
 */
function searchEmojiDom(query) {
    const results = emojiList(query);
    emojiTiles.replaceChildren(...results.map(e => renderEmojiCard(e)));
}

/**
 * Dead-simple debouncer.
 *
 * @param {T} func the function to debounce
 * @param {number} timeout the timeout in milliseconds
 * @returns {T} the debounced function
 * @template T
 */
function debounce(func, timeout = 100) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    emojiTiles = document.getElementById("emoji-tiles");
    // Trigger the initial load.
    searchEmojiDom();

    // Bind the search input to the search function.
    const searchInput = document.getElementById("search-bar");
    const searcher = debounce(searchEmojiDom);
    searchInput.addEventListener("input", () => {
        searcher(searchInput.value);
    });
});

/**
 * @param {Emoji} emoji the emoji to render
 * @return {HTMLDivElement} the emoji card
 */
function renderEmojiCard(emoji) {
    const domElement = document.createElement("div");
    domElement.innerHTML = `
    <div class="card">
        <div class="card-image d-flex is-justify-content-center">
            <figure class="image is-96x96 my-3">
                <img src="${emoji.svgUrl}" alt="${emoji.title}">
            </figure>
        </div>
        <footer class="card-footer">
            <a href="${emoji.detailsUrl}" class="card-footer-item">Details</a>
            <a href="${emoji.svgUrl}" class="card-footer-item">SVG</a>
            <!-- TODO: Enable when we have PNG emoji links -->
            <a href="${emoji.pngUrl}" class="card-footer-item has-text-grey" style="pointer-events: none;">PNG</a>
        </footer>
    </div>
`;
    return domElement;
}

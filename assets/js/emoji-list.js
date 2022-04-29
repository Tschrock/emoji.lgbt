/**
 * Represents a single emoji, in raw form.
 *
 * @typedef {{title: string, slug: string}} RawEmoji
 */

/**
 * Represents a single emoji.
 */
class Emoji {
    constructor(title, slug) {
        this.title = title;
        this.slug = slug;
        this.titleLower = title.toLowerCase();
        this.slugLower = slug.toLowerCase();
    }

    /**
     * Get emoji details url.
     * @returns {string} the emoji details url
     */
    get detailsUrl() {
        return `/emoji/${this.slug}.html`;
    }

    /**
     * Get emoji SVG url.
     * @returns {string} the emoji SVG url
     */
    get svgUrl() {
        return `/assets/svg/${this.slug}.svg`;
    }

    /**
     * Get emoji PNG url.
     * @returns {string} the emoji PNG url
     */
    get pngUrl() {
        return `https://resvg.emoji.lgbt/api/v1/7a31cfe8/${this.slug}.png?width=128`;
    }
}

// Expect the page to hand us all the data in `RAW_SEARCH_DATA`:
/** @typedef {Record<string, RawEmoji>} RAW_SEARCH_DATA */
// Transform it for our purposes:
const SEARCH_DATA = Object.fromEntries(
    Object.entries(RAW_SEARCH_DATA).map(([k, v]) => (
        [k, new Emoji(v.title, v.slug)]
    ))
);

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
function searchEmoji(query) {
    if (!query) {
        return Object.values(SEARCH_DATA);
    }
    const results = [];
    const queryLower = query.toLowerCase();
    for (const emoji of Object.values(SEARCH_DATA)) {
        if (emoji.titleLower.includes(queryLower) || emoji.slugLower.includes(queryLower)) {
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
    const results = searchEmoji(query);
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
    <a href="${emoji.detailsUrl}" role="button" class="card button is-white d-flex is-flex-direction-column p-0" 
       style="width: 196px; height: 196px; white-space: normal;">
        <div class="card-image d-flex is-justify-content-center">
            <figure class="image is-96x96 my-3 p-1 show-off-transparency">
                <img src="${emoji.svgUrl}" alt="${emoji.title}">
            </figure>
        </div>
        <div class="card-content pt-0 pb-1 is-justify-content-center is-flex-grow-1">
            <p class="is-flex-grow-0 has-text-centered has-text-weight-normal">
                ${emoji.title}
            </p>
        </div>
    </a>
`;
    return domElement;
}

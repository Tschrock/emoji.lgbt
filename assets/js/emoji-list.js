/**
 * Represents a single emoji, in raw form.
 *
 * @typedef {{title: string, slug: string}} RawEmoji
 */

/**
 * Represents a single emoji.
 */
class Emoji {
    constructor(id, title, detailsUrl, svgUrl, tags) {
        this.id = id
        this.title = title
        this.detailsUrl = detailsUrl
        this.svgUrl = svgUrl
        this.searchTerms = [
            ...title.toLowerCase().split(' '),
            ...id.split('-'),
            ...(tags || [])
        ]
    }

    /**
     * @param {string[]} terms
     * @returns {boolean}
     */
    match(terms) {
        return terms.every(t => this.searchTerms.includes(t))
    }
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

const readPageData = id => JSON.parse(document.getElementById(id).textContent)

document.addEventListener("DOMContentLoaded", () => {
    const emojiTiles = document.getElementById("emoji-tiles");

    // Read emoji data from page
    const EMOJI_DATA = Object.entries(JSON.parse(
        document.getElementById('emoji-data').textContent
    )).map(([id, data]) =>
        new Emoji(id, data.title, data.url, data.svg, data.tags)
    )

    /**
     * @param {string} query 
     * @returns {Emoji[]}
     */
    function searchEmoji(query) {
        if (!query) return EMOJI_DATA
        const terms = query.toLowerCase().split(' ')
        return EMOJI_DATA.filter(e => e.match(terms))
    }

    function searchEmojiDom(query) {
        const results = searchEmoji(query);
        emojiTiles.replaceChildren(...results.map(e => renderEmojiCard(e)));
    }


    // Bind the search input to the search function.
    const searchInput = document.getElementById("search-bar");
    const searcher = debounce(searchEmojiDom);
    searchInput.addEventListener("input", () => searcher(searchInput.value));

    // Trigger the initial load.
    searchEmojiDom();
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

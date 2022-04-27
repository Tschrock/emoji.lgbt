function onDomContentLoaded() {
    bindNavBurgers();
}

function bindNavBurgers() {
    const navBurgers = document.getElementsByClassName("navbar-burger");

    Array.from(navBurgers).forEach(function ($el) {
        if (!$el.dataset.target) {
            return;
        }

        $el.addEventListener("click", function () {
            const target = $el.dataset.target;
            const $target = document.getElementById(target);
            $el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        onDomContentLoaded();
    } catch (e) {
        console.error("Failed to load controls", e);
    }
});

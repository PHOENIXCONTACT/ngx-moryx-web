// Function executed when page is unloaded
function saveLocation() {
    // Read current location and extract route
    const location = window.location.href.substring(
        (window.location.protocol + '//' + window.location.host).length
    );
    const route = location.split('/')[1];

    // Calculate expiration date
    const now = new Date();
    let time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);

    // Skip cookie if location is identical to route
    if (location.replaceAll('/', '') === route)
        return;

    // Set cookie for location on current route
    document.cookie =
        route + '-location=' + location +
        '; expires=' + now.toUTCString() +
        '; path=/;';
}

// Register to beforeunload
window.onbeforeunload = function () {
    saveLocation();
}

// Export shell object as API for modules
window.shell = function () {
    // Define shell
    const shell = new Object();

    var subscriber = function (filter, complete) { alert(value); };
    shell.onsearch = function (callback) {
        subscriber = callback;
    };

    const suggestions = document.getElementById('search-suggestions');
    var generateSuggestion = function (suggestion) {
        let html = suggestion.url
            ? `<li><a href=${suggestion.url}>${suggestion.text}</a></li>`
            : `<li>${suggestion.text}</li>`
        return html;
    }
    shell.updateSuggestions = function (values) {
        let items = '';
        values.slice(0, 10).forEach(value => {
            if (value.text && value.text.length)
                items += generateSuggestion(value)
        });
        suggestions.innerHTML = items;
        if (items.length) {
            suggestions.classList.add("suggestions");
        } else {
            suggestions.classList.remove("suggestions");
        }
    }

    // Event handlers for search key events and button click
    const searchBox = document.getElementById('search-box');
    shell.search = function () {
        const value = searchBox.value;
        subscriber(value, true);
        searchBox.value = '';
    }
    shell.searchKeyUp = function (event) {
        const value = searchBox.value;
        var complete = event.keyCode === 13;
        subscriber(value, complete);
        if (complete)
            searchBox.value = '';
    }

    return shell;
}();
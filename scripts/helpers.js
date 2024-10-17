// Seeded pseudo-random number generator using xorshift (Credit: ChatGPT)
function seeded_random(seed) {
    return function() {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return (seed < 0 ? ~seed + 1 : seed) % 10000 / 10000;
    };
}

// Fisher-Yates shuffle with seed (Credit: ChatGPT)
function shuffle_with_seed(arr, seed) {
    const random = seeded_random(seed);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1)); // Random index based on seeded RNG
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }

    return arr;
}

// Seedless shuffle algorithm (Credit: ChatGPT)
function shuffle_seedless(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Levenshtein Distance Algorithm (Credit: ChatGPT)
function compare_strings(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // Create a matrix to store distances
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Calculate the cost of substitutions, deletions, or insertions
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    // Get the Levenshtein distance (last element of the matrix)
    const distance = matrix[len1][len2];

    // Calculate similarity as 1 minus the normalized distance
    const maxLength = Math.max(len1, len2);
    return 1 - distance / maxLength;
}

// Sets options for a dropdown HTML element (Credit: ChatGPT)
function set_dropdown(dropdown, options) {
    dropdown.innerHTML = '';

    options.forEach(option => {
        let newOption = document.createElement('option');
        newOption.value = option[0];
        newOption.text = option[1];
        dropdown.appendChild(newOption);
    });
}

// Cookie Helpers (Credit: w3schools)
function setCookie(name, value) {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return JSON.parse(cookie.substring(nameEQ.length, cookie.length));
        }
    }
    return undefined;
}

// General functions to fade elements in & out
async function fadeInElement(element, fadeClass, display, duration) {
    element.style.display = display;
    element.classList.add(fadeClass);

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            element.classList.remove(fadeClass);
            resolve();
        }, duration);
    });
}

async function fadeOutElement(element, fadeClass, duration) {
    element.classList.add(fadeClass);

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            element.classList.remove(fadeClass);
            element.style.display = "none";
            resolve();
        }, duration);
    });
}

/* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */
/* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */
/* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */

// Seeded Shuffler written by ChatGPT

// Seeded pseudo-random number generator using xorshift
function seeded_random(seed) {
    return function() {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return (seed < 0 ? ~seed + 1 : seed) % 10000 / 10000;
    };
}

// Fisher-Yates shuffle with seed
function shuffle_with_seed(arr, seed) {
    const random = seeded_random(seed);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1)); // Random index based on seeded RNG
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }

    return arr;
}

// Levenshtein Distance Algorithm written by ChatGPT
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

// What it sounds like
function trim_lower(str) {
    return str.trim().toLowerCase();
}

/* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */
/* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */
/* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */

const SAQ_DIV = document.getElementById("scq_sa_div");
const SAQ_INPUT_BOX = document.getElementById("scq_sa_input");
const SAQ_INPUT_BTN = document.getElementById("scq_sa_btn");
const SAQ_INPUT_BTN_SVG = document.getElementById("scq_sa_btn_svg_src");
const SAQ_FEEDBACK_DIV = document.getElementById("scq_sa_feedback");
const SAQ_FEEDBACK_SVG = document.getElementById("scq_sa_feedback_svg");
const SAQ_FEEDBACK_TEXT = document.getElementById("scq_sa_feedback_text");

const MCQ_DIV = document.getElementById("scq_mcq_div");
const MCQ_FEEDBACK_DIV = document.getElementById("scq_mcq_feedback");
const MCQ_FEEDBACK_ICONS = document.getElementById("scq_mcq_feedback_icons");
const MCQ_FEEDBACK_TEXT = document.getElementById("scq_mcq_feedback_text");

const SCQ_QNUM = document.getElementById("scq_qnum");
const SCQ_QTYPE = document.getElementById("scq_qtype");
const SCQ_QDESC = document.getElementById("scq_qdesc");


function reset_saq_div() {
    // Clear SAQ Input Div
    SAQ_INPUT_BOX.value = "";
    SAQ_INPUT_BOX.removeAttribute("disabled");
    SAQ_INPUT_BOX.className = "";

    SAQ_INPUT_BTN.removeAttribute("disabled");
    SAQ_INPUT_BTN.className = "";
    SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_submit");
    SAQ_INPUT_BTN.onclick = function() { process_input(["SUBMIT", SAQ_INPUT_BOX.value]) };

    SAQ_INPUT_BOX.addEventListener('input', (event) => {
        process_input(["TYPED_KEY", undefined]);
    });

    SAQ_INPUT_BOX.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            process_input(["SUBMIT", SAQ_INPUT_BOX.value])
        }
    });

    SAQ_FEEDBACK_DIV.style.display = "none";
}

function hide_saq_div() { SAQ_DIV.style.display = "none"; }
function show_saq_div() { SAQ_DIV.style.display = "block"; }

function reset_mcq_div() {

}

function hide_mcq_div() { MCQ_DIV.style.display = "none"; }
function show_mcq_div() { MCQ_DIV.style.display = "block"; }

class MCQOption {
    constructor(letterID, desc, isCorrect) {
        // Create Button
        this.button = document.createElement('button');
        this.button.classList.add('scq_mcq');

        // Button's "Letter" Label
        this.buttonLetter = document.createElement('div');
        this.buttonLetter.classList.add('scq_mcq_label');
        this.buttonLetter.textContent = letterID;

        // Option Answer Text
        this.answerText = document.createElement('p');
        this.answerText.classList.add('scq_mcq_text');
        this.answerText.textContent = desc;

        this.button.appendChild(labelDiv);
        this.button.appendChild(textP);

        this.button.onclick = function() { process_input(this.letterID) };

        // State Vars
        this.highlighted = false; // Used when selecting with "ABCD..." keyboard keys
        this.answeredQ = false; // True = Disabled
        this.isCorrect = isCorrect; // Changes how to render the after answering question
    }

    add_to_div() {
        // Adds the button to MCQ_DIV.
        // Probably call .render() before this.
    }

    render() {
        // Style the button (by modifying classlist & disabled attribute.)
        // Depends on the state vars (see constructor).
    }
}



/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */
/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */
/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */

class SAQQuestion {
    constructor(q, topic, correctAnswers) {
        this.q = q;
        this.topic = topic;
        this.correctAnswers = correctAnswers;

        this.processingSubmit = false;
    }

    render(settings) {
        reset_saq_div();
        hide_mcq_div();
        show_saq_div();

        SCQ_QTYPE.innerText = `Short Answer | ${this.topic}`;
        SCQ_QDESC.innerHTML = this.q;
        SAQ_INPUT_BOX.focus();
    }

    rerender(settings) {

    }

    process_input(event, session) {
        if (event[0] == "SUBMIT") {
            if (this.processingSubmit) {
                return;
            }
            
            let ans = trim_lower(event[1]);
            if (ans != "") {
                this.processingSubmit = true;
                SAQ_INPUT_BTN.setAttribute("disabled", "");

                let isCorrect = false;
                let threshold = 0.77; // TODO: CORRECTNESS THRESHOLD
                for (const ca of this.correctAnswers) {
                    if (compare_strings(ans, trim_lower(ca)) >= threshold) {
                        isCorrect = true;
                        break;
                    }
                }

                if (isCorrect) {
                    SAQ_INPUT_BOX.setAttribute("disabled", "");
                    SAQ_INPUT_BOX.classList.add("correct");

                    SAQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
                    SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
                    SAQ_INPUT_BTN.removeAttribute("disabled", "");
                    SAQ_INPUT_BTN.focus();

                    // TODO: FEEDBACK DIV
                    SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_check");
                    SAQ_FEEDBACK_DIV.className = "scq_feedback correct";
                    SAQ_FEEDBACK_TEXT.innerText = `Correct! (Accepted Answers: ${this.correctAnswers.join(", ")})`;
                    SAQ_FEEDBACK_DIV.style.display = "flex";
                } else {
                    SAQ_INPUT_BOX.classList.add("incorrect");
                    SAQ_INPUT_BTN.removeAttribute("disabled");
                    this.processingSubmit = false;

                    // TODO: FEEDBACK DIV
                    SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_x");
                    SAQ_FEEDBACK_DIV.className = "scq_feedback incorrect";
                    SAQ_FEEDBACK_TEXT.innerText = "Incorrect";
                    SAQ_FEEDBACK_DIV.style.display = "flex";
                }
            }            
        } else if (event[0] == "TYPED_KEY") {
            if (trim_lower(SAQ_INPUT_BOX.value) == "") {
                SAQ_INPUT_BTN.setAttribute("disabled", "");
            } else {
                SAQ_INPUT_BTN.removeAttribute("disabled");
            }
            SAQ_INPUT_BOX.className = "";
        }
    }
}

class MCQQuestion {
    constructor(q, options, correctIdx) {
        this.q = q;
        this.options = options;
        this.correctIdx = correctIdx;
    }
    
    get_type() {
        return "MCQ";
    }

    render() {

    }

    process_input(content, session) {

    }
}

/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */
/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */
/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */

var CURRENT_SESSION = undefined;

class TriviaSession {
    constructor(qSets, settings, seed, qNum) {
        //this.questions = [new MCQQuestion("What is 1 + 1?", ["2", "3", "4", "5"], 0)];
        //this.questions = [new SAQQuestion("What is 1 + 1?", "Debug Problems", ["2"]), new SAQQuestion("What is 1 + 2?", "Debug Problems", ["3"])]
        this.questions = [];
        this.questionNum = qNum;
        this.seed = seed;

        this.settings = settings;
        
        // TODO: Generate Questions From Question Sets

        // Shuffle question order
        this.questionCount = this.questions.length;
        this.questionOrder = shuffle_with_seed(Array.from({ length: this.questionCount }, (_, i) => i), seed);

        this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
    }

    render() {
        SCQ_QNUM.innerText = `Question #${this.questionNum+1}/${this.questionCount}`;
        
        this.currentQuestion.render(this.settings);
    }

    save_progress() {
        // TODO
    }

    process_input(event) {
        if (event[0] == "NEXT") {
            this.questionNum += 1;
            this.save_progress();
            this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
            this.render();

            // TODO: SESSION END
        } else {
            this.currentQuestion.process_input(event, CURRENT_SESSION);
        }
    }
}

function process_input(event) {
    CURRENT_SESSION.process_input(event);
}

/* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */
/* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */
/* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */ /* DEBUG */

CURRENT_SESSION = new TriviaSession(["../questions/apush/1.2", "APUSH 1.2"], undefined, 100, 0);
hide_mcq_div();
CURRENT_SESSION.render();
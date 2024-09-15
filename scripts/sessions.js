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


/* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */
/* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */
/* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */ /* HTML HELPER FUNCTIONS */

const SAQ_INPUT_DIV = document.getElementById("scq_sa_div");
const SAQ_INPUT_BOX = document.getElementById("scq_sa_input");
const SAQ_INPUT_BTN = document.getElementById("scq_sa_btn");
const SAQ_INPUT_BTN_SVG = document.getElementById("scq_sa_btn_svg_src");
const SAQ_FEEDBACK_DIV = document.getElementById("scq_sa_feedback");
const SAQ_FEEDBACK_ICONS = document.getElementById("scq_sa_feedback_icons");
const SAQ_FEEDBACK_TEXT = document.getElementById("scq_sa_feedback_text");

const MCQ_DIV = document.getElementById("scq_mcq_div");
const MCQ_FEEDBACK_DIV = document.getElementById("scq_mcq_feedback");
const MCQ_FEEDBACK_ICONS = document.getElementById("scq_mcq_feedback_icons");
const MCQ_FEEDBACK_TEXT = document.getElementById("scq_mcq_feedback_text");

const SCQ_QNUM = document.getElementById("scq_qnum");
const SCQ_QTYPE = document.getElementById("scq_qtype");
const SCQ_QDESC = document.getElementById("scq_qdesc");


function reset_saq_div() {
    // Hide & Clear SAQ Input Div

}

function hide_saq_div() {

}

function reset_mcq_div() {

}

function hide_mcq_div() {

}

function reset_fdbck_div() {

}

function hide_fdbck_div() {

}

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

class Question {
    constructor() {}
    get_type() { return "Template"; }
    render() {}
    process_input(content, session) {}
}

class SAQQuestion extends Question {
    constructor(q, correctAnswers) {
        this.q = q;
        this.correctAnswers = correctAnswers;
    }

    get_type() {
        return "SAQ";
    }

    render() {

    }

    process_input(content, session) {

    }
}

class MCQQuestion extends Question {
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
        this.questions = [];
        this.questionNum = qNum;
        this.seed = seed;

        this.settings = settings;
        
        // TODO: Generate Questions


        // Shuffle question order
        this.questionCount = this.questions.length();
        this.questionOrder = shuffle_with_seed(Array.from({ length: this.questionCount }, (_, i) => i), seed);

        this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
    }

    render() {
        SCQ_QNUM.innerText = `Question ${this.questionNum+1}/${this.questionCount}`;
        
        this.currentQuestion.render();
    }

    save_progress() {
        // TODO
    }

    process_input(content) {
        let qtype = this.currentQuestion.get_type();

        if (content == "NEXT") {
            // TODO
        } else {
            this.currentQuestion.process_input(content, CURRENT_SESSION);
        }
    }
}

function process_input(content) {
    CURRENT_SESSION.process_input(content);
}
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */

const SAQ_DIV = document.getElementById("scq_sa_div");
const SAQ_INPUT_BOX = document.getElementById("scq_sa_input");
const SAQ_INPUT_BTN = document.getElementById("scq_sa_btn");
const SAQ_INPUT_BTN_SVG = document.getElementById("scq_sa_btn_svg_src");
const SAQ_FEEDBACK_DIV = document.getElementById("scq_sa_feedback");
const SAQ_FEEDBACK_SVG = document.getElementById("scq_sa_feedback_svg");
const SAQ_FEEDBACK_TEXT = document.getElementById("scq_sa_feedback_text");

function reset_saq_div() {
    // Clear SAQ Input Div
    SAQ_INPUT_BOX.value = "";
    SAQ_INPUT_BOX.removeAttribute("disabled");
    SAQ_INPUT_BOX.className = "";

    SAQ_INPUT_BTN.setAttribute("disabled", "");
    SAQ_INPUT_BTN.className = "scq_submit_btn";
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

const MCQ_DIV = document.getElementById("scq_mcq_div");
const MCQ_OPTIONS_DIV = document.getElementById("scq_mcq_options");
const MCQ_INPUT_BTN = document.getElementById("scq_mcq_btn");
const MCQ_INPUT_BTN_TEXT = document.getElementById("scq_mcq_btn_text");
const MCQ_INPUT_BTN_SVG = document.getElementById("scq_mcq_btn_svg_src");
const MCQ_FEEDBACK_DIV = document.getElementById("scq_mcq_feedback");
const MCQ_FEEDBACK_SVG = document.getElementById("scq_mcq_feedback_svg");
const MCQ_FEEDBACK_TEXT = document.getElementById("scq_mcq_feedback_text");

function reset_mcq_div() {
    MCQ_OPTIONS_DIV.innerText = "";
    MCQ_OPTIONS_DIV.style.display = "block";
    MCQ_FEEDBACK_DIV.style.display = "none";

    MCQ_INPUT_BTN.setAttribute("disabled", "");
    MCQ_INPUT_BTN.className = "scq_submit_btn";
    MCQ_INPUT_BTN_SVG.setAttribute("href", "#svg_submit");
    MCQ_INPUT_BTN_TEXT.innerText = "Submit";
    MCQ_INPUT_BTN.onclick = function() { process_input(["SUBMIT", undefined]) };
}

function hide_mcq_div() { MCQ_DIV.style.display = "none"; }
function show_mcq_div() { MCQ_DIV.style.display = "block"; }

const SCQ_QNUM = document.getElementById("scq_qnum");
const SCQ_QTYPE = document.getElementById("scq_qtype");
const SCQ_QDESC = document.getElementById("scq_qdesc");
const SCQ_SKIP_BTN = document.getElementById("scq_skip_btn");
const SCQ_DIV = document.getElementById("session_content_question_div");

function reset_scq_div() {
    reset_saq_div();
    reset_mcq_div();
}

function hide_scq_div() { SCQ_DIV.style.display = "none"; }
function show_scq_div() { SCQ_DIV.style.display = "block"; }
function hide_scq_div_except(toShow) {
    if (toShow == "saq") { show_saq_div(); } else { hide_saq_div(); }
    if (toShow == "mcq") { show_mcq_div(); } else { hide_mcq_div(); }
}

const SCE_DIV = document.getElementById("session_content_end_div");
const SCE_BACK_BTN = document.getElementById("sce_backtomm_btn");

function reset_sce_div() {
    SCE_BACK_BTN.removeAttribute("disabled");
    SCE_BACK_BTN.onclick = close_session;
}

function hide_sce_div() { SCE_DIV.style.display = "none"; }
function show_sce_div() { SCE_DIV.style.display = "block"; }

const SESSION_DIV = document.getElementById("session_div");
const SESSION_SETTINGS_BTN = document.getElementById("session_settings_btn");
const SESSION_STATS_BTN = document.getElementById("session_stats_btn");
const SESSION_HISTORY_BTN = document.getElementById("session_history_btn");
const SESSION_MM_BTN = document.getElementById("session_mainmenu_btn");

function reset_session_div() {
    reset_scq_div();
    reset_sce_div();

    SESSION_SETTINGS_BTN.onclick = open_settings_div;

    SESSION_MM_BTN.removeAttribute("disabled");
    SESSION_MM_BTN.onclick = close_session;
}

function hide_session_div() { SESSION_DIV.style.display = "none"; }
function show_session_div() { SESSION_DIV.style.display = "flex"; }

async function fadein_session_div() { return fade_in_element(SESSION_DIV, "basic_fadein", "flex", 200); }
async function fadeout_session_div() { return fade_out_element(SESSION_DIV, "basic_fadeout", 200); }

/* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */
/* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */
/* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */

KEYS_LISTENING = {}
function add_letter_keybind(letter) { KEYS_LISTENING[letter] = true; }
function remove_letter_keybind(letter) { KEYS_LISTENING[letter] = false; }

function handle_keypress(event) {
    const key = event.key.toLowerCase();
    if (KEYS_LISTENING[key] && CURRENT_SESSION.settings.mcqshortcut) {
        process_input(["OPTION_SELECT", "abcdefghijklmnopqrstuvwxyz".indexOf(key)]);
    }
}

var LAST_ENTER_PRESS = 0;
var ENTER_DOWN = false;
const DOUBLE_TAP_THRESHOLD = 300;

function enter_press_listener(event) {
    if (CURRENT_SESSION.settings.skipshortcut) {
        if (event.key == "Enter" && !ENTER_DOWN) {
            ENTER_DOWN = true;
            const currentTime = Date.now();
            if (!CURRENT_SESSION.currentQuestion.processingSubmit) {
                let type = CURRENT_SESSION.currentQuestion.type;
                let blank = false;
                if (type == "SAQ") {
                    blank = (trim_lower(SAQ_INPUT_BOX.value) == "");
                } else if (type == "MCQ") {
                    blank = (CURRENT_SESSION.currentQuestion.selected == undefined);
                }

                if (blank) {
                    if (currentTime - LAST_ENTER_PRESS <= DOUBLE_TAP_THRESHOLD) {
                        event.preventDefault();
                        process_input(["SKIP", ""]);
                        LAST_ENTER_PRESS = 0;
                    } else {
                        LAST_ENTER_PRESS = currentTime;
                    }
                } else {
                    LAST_ENTER_PRESS = 0;
                }
            } else {
                LAST_ENTER_PRESS = 0;
            }
        } else if (event.key != "Enter") {
            LAST_ENTER_PRESS = 0;
        }
    }
}

function enter_release_listener(event) {
    if (event.key == "Enter") {
        ENTER_DOWN = false;
    }
}

/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */
/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */
/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */

const QUESTION_STATUS = {
    UNSOLVED: 0,
    CORRECT: 1,
    INCORRECT: 2,
    SKIPPED: 3
}

class SAQQuestion {
    constructor(q, topic, correctAnswers) {
        this.type = "SAQ";
        
        this.q = q;
        this.topic = topic;
        this.correctAnswers = correctAnswers;

        this.processingSubmit = false;

        this.status = QUESTION_STATUS.UNSOLVED;
    }
    
    get_status() {
        return this.status;
    }

    render(settings) {
        this.processingSubmit = false;

        reset_saq_div();
        hide_scq_div_except("saq");

        if (settings.showtopic) SCQ_QTYPE.innerText = `Short Answer | ${this.topic}`;
        else SCQ_QTYPE.innerText = `Short Answer`;

        SCQ_QDESC.innerHTML = this.q;
        SAQ_INPUT_BOX.focus();
    }

    rerender(settings) {
        if (settings.showtopic) SCQ_QTYPE.innerText = `Short Answer | ${this.topic}`;
        else SCQ_QTYPE.innerText = `Short Answer`;
    }

    process_input(event, settings) {
        if (this.processingSubmit) { return; }

        if (event[0] == "SKIP") {
            this.processingSubmit = true;
            SCQ_SKIP_BTN.setAttribute("disabled", "");
            SAQ_INPUT_BOX.setAttribute("disabled", "");
            SAQ_INPUT_BTN.setAttribute("disabled", "");

            SAQ_INPUT_BOX.classList.add("skipped");
            SAQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
            SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
            SAQ_INPUT_BTN.removeAttribute("disabled", "");
            SAQ_INPUT_BTN.focus();

            SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_mincirc");
            SAQ_FEEDBACK_DIV.className = "scq_feedback skipped";
            SAQ_FEEDBACK_TEXT.innerText = `Skipped! Accepted Answers: ${this.correctAnswers.join(", ")}`;
            SAQ_FEEDBACK_DIV.style.display = "flex";

            this.status = QUESTION_STATUS.SKIPPED;
        } if (event[0] == "SUBMIT") {
            let ans = trim_lower(event[1]);
            if (ans != "") {
                this.processingSubmit = true;
                SAQ_INPUT_BTN.setAttribute("disabled", "");

                let isCorrect = false;
                let threshold = [0.00, 0.65, 0.77, 0.85, 1.00][settings.checker];
                for (const ca of this.correctAnswers) {
                    if (compare_strings(ans, trim_lower(ca)) >= threshold) {
                        isCorrect = true;
                        break;
                    }
                }

                if (isCorrect) {
                    SCQ_SKIP_BTN.setAttribute("disabled", "");
                    SAQ_INPUT_BOX.setAttribute("disabled", "");
                    SAQ_INPUT_BOX.classList.add("correct");

                    SAQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
                    SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
                    SAQ_INPUT_BTN.removeAttribute("disabled", "");
                    SAQ_INPUT_BTN.focus();

                    SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_check");
                    SAQ_FEEDBACK_DIV.className = "scq_feedback correct";
                    SAQ_FEEDBACK_TEXT.innerText = `Correct! (Accepted Answers: ${this.correctAnswers.join(", ")})`;
                    SAQ_FEEDBACK_DIV.style.display = "flex";

                    if (this.status != QUESTION_STATUS.INCORRECT) {
                        this.status = QUESTION_STATUS.CORRECT;
                        if (settings.confetti) toss_confetti_at_element(SAQ_INPUT_BTN, 10);
                    }
                } else {
                    SAQ_INPUT_BOX.classList.add("incorrect");
                    SAQ_INPUT_BTN.removeAttribute("disabled");
                    this.processingSubmit = false;

                    SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_x");
                    SAQ_FEEDBACK_DIV.className = "scq_feedback incorrect";
                    SAQ_FEEDBACK_TEXT.innerText = "Incorrect";
                    SAQ_FEEDBACK_DIV.style.display = "flex";

                    this.status = QUESTION_STATUS.INCORRECT;
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

class MCQOption {
    constructor(idx, letter, desc, isCorrect) {
        // Create Button
        this.button = document.createElement('button');
        this.button.classList.add('scq_mcq');

        // Button's "Letter" Label
        this.buttonLetter = document.createElement('div');
        this.buttonLetter.classList.add('scq_mcq_label');
        this.buttonLetter.textContent = letter;

        // Option Answer Text
        this.answerText = document.createElement('p');
        this.answerText.classList.add('scq_mcq_text');
        this.answerText.innerHTML = desc;

        this.button.appendChild(this.buttonLetter);
        this.button.appendChild(this.answerText);

        this.idx = idx;
        this.letter = letter;
        this.button.onclick = function() { process_input(["OPTION_SELECT", idx]) };
    }

    add_to_div() {
        // Adds the button to MCQ_DIV.
        // Probably call .render() before this.
        MCQ_OPTIONS_DIV.appendChild(this.button);
    }

    render(disabled, button_class) {
        // Style the button (by modifying classlist & disabled attribute.)
        // Depends on the state vars (see constructor).
        if (disabled) {
            this.button.setAttribute("disabled", "");
        } else {
            this.button.removeAttribute("disabled");
        }

        this.button.className = "scq_mcq " + button_class;
    }
}

class MCQQuestion {
    constructor(q, topic, correct, wrongAnswers) {
        this.type = "MCQ";

        this.q = q;
        this.topic = topic;
        this.correctAnswer = correct;
        this.correctIdx = undefined;
        this.wrongAnswers = wrongAnswers;

        this.selected = undefined;
        this.buttons = [];

        this.processingSubmit = false;

        this.status = QUESTION_STATUS.UNSOLVED;
    }

    get_status() {
        return this.status;
    }
    
    render(settings) {
        this.processingSubmit = false;
        reset_mcq_div();
        
        this.selected = undefined;
        this.correctIdx = Math.floor(Math.random() * (this.wrongAnswers.length+1));
        this.buttons = [];
        
        let waList = shuffle(this.wrongAnswers);
        let options = waList.slice(0, this.correctIdx).concat([this.correctAnswer]).concat(waList.slice(this.correctIdx));
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i in options) {
            this.buttons.push(new MCQOption(i, alphabet[i], options[i], i == this.correctIdx));
            this.buttons[i].render(false, "");
            this.buttons[i].add_to_div();
            add_letter_keybind(alphabet[i].toLowerCase());
        }

        hide_scq_div_except("mcq");

        if (settings.showtopic) SCQ_QTYPE.innerText = `Multiple Choice | ${this.topic}`;
        else SCQ_QTYPE.innerText = `Multiple Choice`;
        
        SCQ_QDESC.innerHTML = this.q;
    }

    rerender(settings) {
        if (settings.showtopic) SCQ_QTYPE.innerText = `Multiple Choice | ${this.topic}`;
        else SCQ_QTYPE.innerText = `Multiple Choice`;
    }

    process_input(event, settings) {
        if (this.processingSubmit) { return; }

        if (event[0] == "SKIP") {
            this.processingSubmit = true;
            SCQ_SKIP_BTN.setAttribute("disabled", "");
            MCQ_INPUT_BTN.setAttribute("disabled", "");

            for (let idx in this.buttons) {
                this.buttons[idx].render(true, idx == this.correctIdx ? "greendashed" : "")
                remove_letter_keybind("abcdefghijklmnopqrstuvwxyz"[idx]);
            }

            MCQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
            MCQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
            MCQ_INPUT_BTN_TEXT.innerText = "Next";
            MCQ_INPUT_BTN.removeAttribute("disabled", "");
            MCQ_INPUT_BTN.focus();

            MCQ_FEEDBACK_SVG.setAttribute("href", "#svg_mincirc");
            MCQ_FEEDBACK_DIV.className = "scq_feedback skipped";
            MCQ_FEEDBACK_TEXT.innerText = `Skipped! Correct Answer: ${this.buttons[this.correctIdx].letter}`;
            MCQ_FEEDBACK_DIV.style.display = "flex";

            this.status = QUESTION_STATUS.SKIPPED;
        } else if (event[0] == "SUBMIT") {
            if (this.selected != undefined) {
                this.processingSubmit = true;
                SCQ_SKIP_BTN.setAttribute("disabled", "");
                MCQ_INPUT_BTN.setAttribute("disabled", "");
                let isCorrect = (this.selected == this.correctIdx);

                if (isCorrect) {
                    for (let idx in this.buttons) {
                        this.buttons[idx].render(true, idx == this.correctIdx ? "green" : "")
                        remove_letter_keybind("abcdefghijklmnopqrstuvwxyz"[idx]);
                    }
                    MCQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
                    MCQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
                    MCQ_INPUT_BTN_TEXT.innerText = "Next";
                    MCQ_INPUT_BTN.removeAttribute("disabled", "");
                    MCQ_INPUT_BTN.focus();

                    MCQ_FEEDBACK_SVG.setAttribute("href", "#svg_check");
                    MCQ_FEEDBACK_DIV.className = "scq_feedback correct";
                    MCQ_FEEDBACK_TEXT.innerText = `Correct!`;
                    MCQ_FEEDBACK_DIV.style.display = "flex";
                    
                    if (this.status != QUESTION_STATUS.INCORRECT) {
                        this.status = QUESTION_STATUS.CORRECT;
                        if (settings.confetti) toss_confetti_at_element(MCQ_INPUT_BTN, 10);
                    }
                } else {
                    this.buttons[this.selected].render(false, "red");
                    this.buttons[this.selected].button.focus();
                    MCQ_INPUT_BTN.removeAttribute("disabled");
                    this.processingSubmit = false;

                    MCQ_FEEDBACK_SVG.setAttribute("href", "#svg_x");
                    MCQ_FEEDBACK_DIV.className = "scq_feedback incorrect";
                    MCQ_FEEDBACK_TEXT.innerText = "Incorrect";
                    MCQ_FEEDBACK_DIV.style.display = "flex";

                    this.status = QUESTION_STATUS.INCORRECT;
                }
            }            
        } else if (event[0] == "OPTION_SELECT") {
            let newSelected = event[1];
            if (newSelected == this.selected) {
                MCQ_INPUT_BTN.setAttribute("disabled", "");
                this.buttons[this.selected].selected = false;
                this.buttons[this.selected].render(false, "");
                this.selected = undefined;
            } else {
                this.buttons[newSelected].selected = true;
                this.buttons[newSelected].render(false, "blue")
                
                if (this.selected != undefined) {
                    this.buttons[this.selected].selected = false;
                    this.buttons[this.selected].render(false, "");
                }

                this.selected = newSelected;
                MCQ_INPUT_BTN.removeAttribute("disabled");
                MCQ_INPUT_BTN.focus();
            }
        }
    }
}

/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */
/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */
/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */

var CURRENT_SESSION = undefined;

class TriviaSession {
    constructor() {
        this.questionNum = 0;
        this.questionCount = -1;
    }
    
    build(subject, topics) {
        this.subject = subject;
        this.topics = topics;

        this.questions = [];
        for (let topic of topics) {
            this.questions = this.questions.concat(QUESTIONS_BY_TOPIC[subject][topic]);
        }

        this.questionNum = 0;
        this.questionCount = this.questions.length;

        this.questionOrder = shuffle(Array.from({ length: this.questionCount }, (_, i) => i));

        this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
    }

    firstrender() {
        reset_session_div();
        hide_sce_div();
        show_scq_div();
        fadein_session_div();
        this.render();
        this.save_progress();
    }

    render() {
        if (this.questionNum >= this.questionCount) {
            hide_scq_div();
            show_sce_div();
        } else {
            SCQ_QNUM.innerText = `Question #${this.questionNum+1}/${this.questionCount}`;
            SCQ_SKIP_BTN.onclick = function() { process_input(["SKIP", ""]) };
            SCQ_SKIP_BTN.removeAttribute("disabled");

            this.currentQuestion.render(this.settings);
        }
    }

    rerender() {
        this.currentQuestion.rerender(this.settings);
    }

    load_settings(settings) {
        this.settings = settings;
    }
    
    load_progress(session) {
        try {
            this.build(session.subject, session.topics);
            this.questionNum = session.questionNum;
            this.questionOrder = session.questionOrder;
            this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
            return true;
        } catch {
            return false;
        }
    }

    save_progress() {
        let session;
        if (this.questionNum >= this.questionCount) {
            session = {
                "inSession": false
            };
        } else {
            session = {
                "inSession": true,
                "subject": this.subject,
                "topics": this.topics,
                "questionNum": this.questionNum,
                "questionOrder": this.questionOrder
            };
        }

        save_data("rapidfire_session", session);
    }

    process_input(event) {
        if (event[0] == "NEXT") {
            let qStatus = this.currentQuestion.get_status();

            if ((qStatus == QUESTION_STATUS.SKIPPED && this.settings.redoskipped)
                || (qStatus == QUESTION_STATUS.INCORRECT && this.settings.redofailed)) {
                let from = this.questionNum;
                let to = (this.settings.randomdoover ? (Math.floor(Math.random() * (this.questionCount - from) + from)) : this.questionCount - 1);
                const [id] = this.questionOrder.splice(from, 1);
                this.questionOrder.splice(to, 0, id);
            } else {
                this.questionNum += 1;
            }
            
            this.save_progress();

            if (this.questionNum >= this.questionCount) {
                this.currentQuestion = undefined;
            } else {
                this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
            }

            this.render();
        } else {
            this.currentQuestion.process_input(event, this.settings);
        }
    }
}

function process_input(event) {
    CURRENT_SESSION.process_input(event);
}

/* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */
/* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */
/* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */ /* SETTINGS MENU */

const SETTINGS_WRAPPER_DIV = document.getElementById("settings_wrapper");
const SETTINGS_CLOSE_BTN = document.getElementById("settings_close_btn");

var CURRENT_SETTINGS = {};
var DEFAULT_SETTINGS = {
    "checker": 2,
    "showtopic": true,
    "skipshortcut": false,
    "mcqshortcut": true,
    "redoskipped": true,
    "redofailed": false,
    "randomdoover": false,
    "confetti": true
}

function setup_settings_div() {
    SETTINGS_CLOSE_BTN.onclick = close_settings_div;
    for (const key in CURRENT_SETTINGS) {
        const ele = document.getElementById(`settings_inp_${key}`);
        if (ele.tagName === "SELECT") {
            ele.addEventListener("change", function() {
                CURRENT_SETTINGS[key] = ele.value;
                save_data("rapidfire_settings", CURRENT_SETTINGS);
            });
        } else {
            ele.addEventListener("change", function() {
                CURRENT_SETTINGS[key] = ele.checked;
                save_data("rapidfire_settings", CURRENT_SETTINGS);
            });
        }
    }
}

function render_settings_div() {
    SETTINGS_CLOSE_BTN.removeAttribute("disabled");

    for (const key in CURRENT_SETTINGS) {
        const ele = document.getElementById(`settings_inp_${key}`);
        const val = CURRENT_SETTINGS[key];
        if (ele.tagName === "SELECT") {
            ele.value = val;
        } else {
            ele.checked = val;
        }
    }
}

async function open_settings_div() {
    render_settings_div();
    await fadein_settings_div();
}

function reset_settings() {
    for (const key in DEFAULT_SETTINGS) {
        CURRENT_SETTINGS[key] = DEFAULT_SETTINGS[key];
    }

    save_data("rapidfire_settings", CURRENT_SETTINGS);   
    render_settings_div();
}

function close_settings_div() {
    SETTINGS_CLOSE_BTN.setAttribute("disabled", "");

    if (CURRENT_SESSION != undefined) {
        CURRENT_SESSION.load_settings(CURRENT_SETTINGS);
        CURRENT_SESSION.rerender();
    }

    save_data("rapidfire_settings", CURRENT_SETTINGS);
    fadeout_settings_div();
}

async function fadein_settings_div() { return fade_in_element(SETTINGS_WRAPPER_DIV, "basic_fadein", "flex", 200); }
async function fadeout_settings_div() { return fade_out_element(SETTINGS_WRAPPER_DIV, "basic_fadeout", 200); }

/* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */
/* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */
/* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */ /* CLOSE SESSION */

async function close_session() {
    SCE_BACK_BTN.setAttribute("disabled", "");        
    SESSION_MM_BTN.setAttribute("disabled", "");

    CURRENT_SESSION.save_progress();
    reset_mm_div();
    await fadeout_session_div();
    await fadein_mm_div();
}
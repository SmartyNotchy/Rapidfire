/* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */
/* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */
/* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */

async function resume_session() {
    let inSession = getCookie("inSession");
    if (inSession) {
        CURRENT_SESSION = undefined;
        try {
            CURRENT_SESSION = new TriviaSession(getCookie("subject"), getCookie("topics"), getCookie("questionNum"), getCookie("seed"), undefined);
        } catch (error) {
            alert("Oops! If you're reading this, something went horribly wrong while trying to load your session. Please report this on the Github!\n\n" + error);
            return;
        }

        MENU_BTN_RESUME.setAttribute("disabled", "");
        await fadeout_mm_div();
        CURRENT_SESSION.firstrender();
    }
}

/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */
/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */
/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */

class PresetMenuElement {
    constructor(subject, preset) {
        this.topics = PRESETS[subject][preset];
        this.numTopics = this.topics.length;

        this.selected = [];
        this.questions = [];
        this.questionLengths = [];

        for (let i = 0; i < this.numTopics; i++) {
            this.selected.push(false);
            let tempQuestions = QUESTION_BANK[subject][this.topics[i]]
            this.questions.push(tempQuestions)
            this.questionLengths.push(tempQuestions.length);
        }

        this.dropdownDiv = document.createElement("div");
        this.dropdownDiv.className = "mmns_ts_preset";

        this.dropdownBtn = document.createElement("button");
        this.dropdownBtn.className = "mmns_ts_dropdown_btn";
        this.dropdownBtn.innerText = "+";
        this.dropdownDiv.appendChild(this.dropdownBtn);
        
        this.dropdownTitle = document.createElement("p");
        this.dropdownTitle.className = "mmns_ts_preset_name";
        this.dropdownTitle.innerText = preset;
        this.dropdownDiv.appendChild(this.dropdownTitle);

        this.sallBtn = document.createElement("button");
        this.sallBtn.classList = "mmns_ts_presetmod_btn mmns_ts_sall_btn";
        this.sallBtn.innerText = "Select All";
        this.dropdownDiv.appendChild(this.sallBtn);

        this.dsallBtn = document.createElement("button");
        this.dsallBtn.classList = "mmns_ts_presetmod_btn mmns_ts_dsall_btn";
        this.dsallBtn.innerText = "De-select All";
        this.dsallBtn.setAttribute("disabled", "");
        this.dropdownDiv.appendChild(this.dsallBtn);

        this.dropdownCount = document.createElement("p");
        this.dropdownCount.className = "mmns_ts_preset_count";
        this.dropdownCount.innerText = "0 selected";
        this.dropdownDiv.appendChild(this.dropdownCount);
    }

    firstrender() {
        MMNS_TS_DIV.appendChild(this.dropdownDiv);
    }

    render() {

    }

    process_input() {
        // Returns the change in questions selected
        
    }

    get_questions() {

    }
}

const MMNS_WRAPPER_DIV = document.getElementById("mainmenu_newsession_wrapper");
const MMNS_SUBJECT_DROPDOWN = document.getElementById("mmns_subject_dropdown");
const MMNS_CANCEL_BTN = document.getElementById("mmns_cancel_btn");
const MMNS_CREATE_BTN = document.getElementById("mmns_create_btn");

const MMNS_TS_TITLE = document.getElementById("mmns_ts_title");
const MMNS_TS_SUBTITLE = document.getElementById("mmns_ts_subtitle");

const MMNS_TS_DIV = document.getElementById("mmns_topic_select_div");

var MMNS_TS_MENU_ELEMENTS = [];

function clear_mmns_ts_div() {
    MMNS_TS_TITLE.style.color = "gray";
    MMNS_TS_SUBTITLE.style.color = "gray";
    MMNS_TS_SUBTITLE.innerText = "Select a subject first!";

    MMNS_TS_DIV.innerHTML = "";
    MMNS_TS_MENU_ELEMENTS = [];
}

function build_mmns_ts_div(subject) {
    MMNS_TS_TITLE.style.color = "white";
    MMNS_TS_SUBTITLE.style.color = "white";
    MMNS_TS_SUBTITLE.innerText = `Subject: ${SUBJECTS[subject]} (TODO: Put something meaningful here)`;

    MMNS_TS_DIV.innerHTML = "";
    MMNS_TS_MENU_ELEMENTS = [];

    let subjPresets = PRESETS[subject];
    for (let preset of Object.entries(subjPresets)) {
        let menuEle = new PresetMenuElement(subject, preset[0]);
        MMNS_TS_MENU_ELEMENTS.push(menuEle);
        menuEle.firstrender();
    }
}

function reset_mmns_div() {
    clear_mmns_ts_div();

    set_dropdown(MMNS_SUBJECT_DROPDOWN, Object.entries(SUBJECTS));
    MMNS_CANCEL_BTN.removeAttribute("disabled");
    MMNS_CANCEL_BTN.onclick = fadeout_mmns_div;
    MMNS_CREATE_BTN.setAttribute("disabled", "");
    MMNS_CREATE_BTN.onclick = create_new_session;

    MMNS_SUBJECT_DROPDOWN.addEventListener("change", render_mmns_div);
    
    render_mmns_div(true);
}

function render_mmns_div() {
    let subject = MMNS_SUBJECT_DROPDOWN.value;

    if (subject == "None") {
        MMNS_CREATE_BTN.setAttribute("disabled", "");
        clear_mmns_ts_div();
    } else {
        //MMNS_CREATE_BTN.removeAttribute("disabled", "");
        build_mmns_ts_div(subject);
    }
}

function hide_mmns_div() { MMNS_WRAPPER_DIV.style.display = "none"; }
function show_mmns_div() { MMNS_WRAPPER_DIV.style.display = "flex"; }

async function fadein_mmns_div() { return fade_in_element(MMNS_WRAPPER_DIV, "basic_fadein", "flex", 100); }
async function fadeout_mmns_div() { return fade_out_element(MMNS_WRAPPER_DIV, "basic_fadeout", 100); }

async function create_new_session() {
    let subject = MMNS_SUBJECT_DROPDOWN.value;
    let preset = MMNS_PRESET_DROPDOWN.value;

    if (subject == "None" || preset == "None") {
        return;
    }

    MMNS_CANCEL_BTN.setAttribute("disabled", "");
    MMNS_CREATE_BTN.setAttribute("disabled", "");
    hide_mm_div();

    let topics = PRESETS[subject][preset]; // TODO CUSTOMS
    CURRENT_SESSION = new TriviaSession(subject, topics, 0, Math.floor(Math.random() * 1000000000000), undefined);
    
    CURRENT_SESSION.firstrender();
    fadeout_mmns_div();
}

/* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */
/* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */
/* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */

const MENU_BTN_RESUME = document.getElementById("mainmenu_btn_continue");
const MENU_BTN_NS = document.getElementById("mainmenu_btn_new");
const MENU_BTN_SETTINGS = document.getElementById("mainmenu_btn_settings");
const MENU_BTN_STATS = document.getElementById("mainmenu_btn_stats");
const MENU_BTN_CONTRIBUTE = document.getElementById("mainmenu_btn_contribute");

const MAINMENU_DIV = document.getElementById("mainmenu_div");

function reset_mm_div() {
    reset_mmns_div();
    reset_settings_div();

    //if (getCookie("inSession")) { MENU_BTN_RESUME.removeAttribute("disabled"); } 
    //else { MENU_BTN_RESUME.setAttribute("disabled", ""); }

    MENU_BTN_RESUME.onclick = resume_session;
    MENU_BTN_NS.onclick = fadein_mmns_div;
    MENU_BTN_SETTINGS.onclick = fadein_settings_div;
}

function hide_mm_div() { MAINMENU_DIV.style.display = "none"; }
function show_mm_div() { MAINMENU_DIV.style.display = "flex"; }

async function fadein_mm_div() { return fade_in_element(MAINMENU_DIV, "basic_fadein", "flex", 100); }
async function fadeout_mm_div() { return fade_out_element(MAINMENU_DIV, "basic_fadeout", 100); }

/* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */
/* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */
/* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */ /* LOADING DIV */

const LOADING_DIV = document.getElementById("loading_div");

const LD_LOADER = document.getElementById("ld_loader");
const LD_SVG_SRC = document.getElementById("ld_svg_src");

const LD_INITIAL_DIV = document.getElementById("ld_initial");
const LD_INITIAL_TITLE = document.getElementById("ld_initial_title");
const LD_INITIAL_SUBTITLE = document.getElementById("ld_initial_subtitle");

const LD_ERROR_DIV = document.getElementById("ld_error");
const LD_ERROR_TITLE = document.getElementById("ld_error_title");
const LD_ERROR_SUBTITLE = document.getElementById("ld_error_subtitle");
const LD_ERROR_LIST = document.getElementById("ld_error_list");
const LD_ERROR_RETRY = document.getElementById("ld_error_retry");
const LD_ERROR_PROCEED = document.getElementById("ld_error_proceed");

const LD_MOBILE_DIV = document.getElementById("ld_mobile");
const LD_MOBILE_TITLE = document.getElementById("ld_mobile_title");
const LD_MOBILE_SUBTITLE = document.getElementById("ld_mobile_subtitle");
const LD_MOBILE_PROCEED = document.getElementById("ld_mobile_proceed");

var LD_ERRORS = [];
var LD_WARNING_QSET = false;
var LD_WARNING_MOBILE = false;

async function attempt_load_mm() {
    // QSet Warning Screen
    if (LD_WARNING_QSET) {
        LD_INITIAL_DIV.style.display = "none";
        LD_MOBILE_DIV.style.display = "none";

        LD_LOADER.classList.add("error");
        LD_SVG_SRC.setAttribute("href", "#svg_warning");
        LD_SVG_SRC.style.color = "#ff0000";

        if (LD_ERRORS.length <= 5) {
            LD_ERROR_LIST.innerHTML = LD_ERRORS.join("<br>");
        } else {
            LD_ERROR_LIST.innerHTML = LD_ERRORS.slice(0, 6).concat([`... (${LD_ERRORS.length - 6} more)`]).join("<br>");
        }
        
        LD_ERROR_RETRY.onclick = function() { LD_ERROR_RETRY.setAttribute("disabled", true); LD_ERROR_PROCEED.setAttribute("disabled", true); location.reload(); };
        LD_ERROR_PROCEED.onclick = function() { LD_ERROR_RETRY.setAttribute("disabled", true); LD_ERROR_PROCEED.setAttribute("disabled", true); LD_WARNING_QSET = false; attempt_load_mm(); };
        LD_ERROR_DIV.style.display = "block";

        return;
    }

    // Mobile Warning Screen
    if (LD_WARNING_MOBILE) {
        LD_INITIAL_DIV.style.display = "none";
        LD_ERROR_DIV.style.display = "none";

        LD_LOADER.classList.add("error");
        LD_SVG_SRC.setAttribute("href", "#svg_phone");
        LD_SVG_SRC.style.color = "#ff0000";
        
        LD_MOBILE_PROCEED.onclick = function() { LD_MOBILE_PROCEED.setAttribute("disabled", true); LD_WARNING_MOBILE = false; attempt_load_mm(); };
        LD_MOBILE_DIV.style.display = "block";

        return;
    }

    // Fade Out Loading Div
    await fade_out_element(LOADING_DIV, "basic_fadeout", 250);

    // Set Visibilities
    reset_mm_div();
    show_mm_div();

    reset_mmns_div();
    hide_mmns_div();

    reset_session_div();
    hide_session_div();

    // Set Event Listeners
    document.addEventListener("keydown", handle_keypress);
    
    // Fade In Main Menu
    fadein_mm_div();
}

window.onload = async function() {
    LD_ERRORS = await load_directory();
    if (LD_ERRORS.length > 0) { LD_WARNING_QSET = true; };
    if (window.innerWidth < 800 || navigator.userAgent.match(/Mobile/i) != null) { LD_WARNING_MOBILE = true; }
    
    attempt_load_mm();
}
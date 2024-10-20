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

const MMNS_WRAPPER_DIV = document.getElementById("mainmenu_newsession_wrapper");
const MMNS_SUBJECT_DROPDOWN = document.getElementById("mmns_subject_dropdown");
const MMNS_PRESET_DROPDOWN = document.getElementById("mmns_preset_dropdown");
const MMNS_CANCEL_BTN = document.getElementById("mmns_cancel_btn");
const MMNS_CREATE_BTN = document.getElementById("mmns_create_btn");

function reset_mmns_div() {
    set_dropdown(MMNS_SUBJECT_DROPDOWN, Object.entries(SUBJECTS));
    set_dropdown(MMNS_PRESET_DROPDOWN, []);
    MMNS_PRESET_DROPDOWN.setAttribute("disabled", "");
    MMNS_CANCEL_BTN.removeAttribute("disabled");
    MMNS_CANCEL_BTN.onclick = fadeout_mmns_div;
    MMNS_CREATE_BTN.setAttribute("disabled", "");
    MMNS_CREATE_BTN.onclick = create_new_session;

    MMNS_SUBJECT_DROPDOWN.addEventListener("change", function() { render_mmns_div(true) });
    MMNS_PRESET_DROPDOWN.addEventListener("change", function() { render_mmns_div(false) });

    render_mmns_div(true);
}

function render_mmns_div(changedTopic) {
    let subject = MMNS_SUBJECT_DROPDOWN.value;
    let preset = MMNS_PRESET_DROPDOWN.value;

    if (subject == "None") {
        MMNS_PRESET_DROPDOWN.setAttribute("disabled", "");
        set_dropdown(MMNS_PRESET_DROPDOWN, []);
        MMNS_CREATE_BTN.setAttribute("disabled", "");
    } else {
        if (changedTopic) {
            set_dropdown(MMNS_PRESET_DROPDOWN, Object.entries(PRESETS[subject]).map(a => [a[0], a[0]]));
            MMNS_PRESET_DROPDOWN.removeAttribute("disabled");
            MMNS_CREATE_BTN.removeAttribute("disabled", "");
        }
    }
}

function hide_mmns_div() { MMNS_WRAPPER_DIV.style.display = "none"; }
function show_mmns_div() { MMNS_WRAPPER_DIV.style.display = "flex"; }

async function fadein_mmns_div() { return fadeInElement(MMNS_WRAPPER_DIV, "basic_fadein", "flex", 100); }
async function fadeout_mmns_div() { return fadeOutElement(MMNS_WRAPPER_DIV, "basic_fadeout", 100); }

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
const MENU_BTN_ABOUT = document.getElementById("mainmenu_btn_about");
const MENU_BTN_CONTRIBUTE = document.getElementById("mainmenu_btn_contribute");

const MAINMENU_DIV = document.getElementById("mainmenu_div");

function reset_mm_div() {
    reset_mmns_div();

    if (getCookie("inSession")) {
        MENU_BTN_RESUME.removeAttribute("disabled");
    } else {
        MENU_BTN_RESUME.setAttribute("disabled", "");
    }
    MENU_BTN_RESUME.onclick = resume_session;
    MENU_BTN_NS.onclick = fadein_mmns_div;
}

function hide_mm_div() { MAINMENU_DIV.style.display = "none"; }
function show_mm_div() { MAINMENU_DIV.style.display = "flex"; }

async function fadein_mm_div() { return fadeInElement(MAINMENU_DIV, "basic_fadein", "flex", 100); }
async function fadeout_mm_div() { return fadeOutElement(MAINMENU_DIV, "basic_fadeout", 100); }

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
    await fadeOutElement(LOADING_DIV, "basic_fadeout", 250);

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
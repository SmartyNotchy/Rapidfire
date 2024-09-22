/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */
/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */
/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */

const MMNS_MENU_BTN = document.getElementById("mainmenu_btn_new");
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
    MMNS_CANCEL_BTN.onclick = hide_mmns_div;
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

function hide_mmns_div() {
    MMNS_WRAPPER_DIV.style.display = "none";
    // TODO: Fade?
}

function show_mmns_div() {
    MMNS_WRAPPER_DIV.style.display = "flex";
    // TODO: Fade?
}

function create_new_session() {
    let subject = MMNS_SUBJECT_DROPDOWN.value;
    let preset = MMNS_PRESET_DROPDOWN.value;

    if (subject == "None" || preset == "None") {
        return;
    }

    MMNS_CANCEL_BTN.setAttribute("disabled", "");
    MMNS_CREATE_BTN.setAttribute("disabled", "");

    hide_mm_div();

    // Load Presets
    let topics = PRESETS[subject][preset];
    let questions = [];
    for (let t of topics) {
        questions = questions.concat(QUESTION_BANK[subject][t]);
    }

    CURRENT_SESSION = new TriviaSession(questions, 0, Math.floor(Math.random() * 1000000000000), undefined);
    CURRENT_SESSION.firstrender();
    hide_mmns_div();
}

/* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */
/* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */
/* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */ /* MAIN MENU */

MAINMENU_DIV = document.getElementById("mainmenu_div");

function reset_mm_div() {
    MMNS_MENU_BTN.onclick = show_mmns_div;
}

function hide_mm_div() {
    MAINMENU_DIV.style.display = "none";
}

function show_mm_div() {
    MAINMENU_DIV.style.display = "flex";
}

window.onload = async function() {
    let res = await load_directory();

    // Set Visibilities
    reset_mm_div();
    show_mm_div();

    reset_mmns_div();
    hide_mmns_div();

    reset_session_div();
    hide_session_div();

    // Set Event Listeners
    document.addEventListener("keydown", handle_keypress);
}
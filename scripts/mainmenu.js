/* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */
/* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */
/* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */ /* LOCAL STORAGE SETUP */

function setup_storage() {
    let session = load_data("rapidfire_session");
    if (Object.keys(session).length == 0) {
        let tempSession = new TriviaSession();
        tempSession.save_progress();
    }
    
    CURRENT_SETTINGS = load_data("rapidfire_settings");
    for (const key in DEFAULT_SETTINGS) {
        if (!CURRENT_SETTINGS.hasOwnProperty(key)) {
            CURRENT_SETTINGS[key] = DEFAULT_SETTINGS[key];
        }
    }
}

/* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */
/* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */
/* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */ /* SESSION RESUMING */

async function resume_session() {
    let session = load_data("rapidfire_session");
    let settings = load_data("rapidfire_settings");
    if (session.inSession) {
        MENU_BTN_RESUME.setAttribute("disabled", "");

        CURRENT_SESSION = new TriviaSession();
        CURRENT_SESSION.load_settings(settings); // TODO
        let success = CURRENT_SESSION.load_progress(session);

        if (!success) {
            alert("Oops! Most likely due to a Rapidfire update, this session is no longer valid. Please start a new one! (If you are consistently getting this message, please file a bug report on the Github.)");
            let tempSession = new TriviaSession();
            tempSession.save_progress();

            return;
        } else {
            await fadeout_mm_div();
            CURRENT_SESSION.firstrender();
        }
    }
}

/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */
/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */
/* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */ /* SESSION CREATION */

class PresetMenuElement {
    constructor(subject, preset, idx) {
        this.topics = PRESETS[subject][preset];
        this.numTopics = this.topics.length;

        this.dropdownToggled = false;
        this.selected = [];
        this.numSelected = 0;
        this.questionLengths = [];

        for (let i = 0; i < this.numTopics; i++) {
            this.selected.push(false);
            let tempQuestions = QUESTIONS_BY_TOPIC[subject][this.topics[i]];
            this.questionLengths.push(tempQuestions.length);
        }

        this.dropdownDiv = document.createElement("div");
        this.dropdownDiv.className = "mmns_ts_preset";

        this.dropdownBtn = document.createElement("button");
        this.dropdownBtn.className = "mmns_ts_dropdown_btn";
        this.dropdownBtn.innerText = "+";
        this.dropdownBtn.onclick = function() { MMNS_TS_MENU_ELEMENTS[idx].toggle_dropdown(); };
        this.dropdownDiv.appendChild(this.dropdownBtn);
        
        this.dropdownTitle = document.createElement("p");
        this.dropdownTitle.className = "mmns_ts_preset_name";
        this.dropdownTitle.innerText = preset;
        this.dropdownDiv.appendChild(this.dropdownTitle);

        this.sallBtn = document.createElement("button");
        this.sallBtn.className = "mmns_ts_sall_btn";
        this.sallBtn.innerText = "Select All";
        this.sallBtn.onclick = function() {
            if (MMNS_TS_MENU_ELEMENTS[idx].sallBtn.classList.contains("active")) {
                MMNS_TS_MENU_ELEMENTS[idx].deselect_all();
            } else {
                MMNS_TS_MENU_ELEMENTS[idx].select_all();
            }
            update_mmns_session();
        }
        this.dropdownDiv.appendChild(this.sallBtn);

        this.dropdownCount = document.createElement("p");
        this.dropdownCount.className = "mmns_ts_preset_count";
        this.dropdownCount.innerText = "0 selected";
        this.dropdownDiv.appendChild(this.dropdownCount);

        this.topicsDiv = document.createElement("div");
        this.topicsDiv.classList = "mmns_ts_topics";
        
        this.topicElements = [];
        for (let i = 0; i < this.numTopics; i++) {
            let topicDiv = document.createElement("div");
            topicDiv.className = "mmns_ts_topic_div";

            let topicBtn = document.createElement("button");
            topicBtn.className = "mmns_ts_topic_btn";
            topicDiv.appendChild(topicBtn);
            topicBtn.onclick = function() { MMNS_TS_MENU_ELEMENTS[idx].toggle_topic(i); update_mmns_session(); };
            
            let topicDesc = document.createElement("p");
            topicDesc.className = "mmns_ts_topic_desc";
            topicDesc.innerText = `${this.topics[i]} (${this.questionLengths[i]} questions)`
            topicDiv.appendChild(topicDesc);
            
            this.topicsDiv.appendChild(topicDiv);
            this.topicElements.push([topicBtn, topicDesc]);
        }
    }

    firstrender() {
        MMNS_TS_DIV.appendChild(this.dropdownDiv);
        MMNS_TS_DIV.appendChild(this.topicsDiv);
    }

    render() {
        let numSelected = 0;
        let allSelected = true;
        for (let i = 0; i < this.numTopics; i++) {
            if (this.selected[i]) {
                numSelected += this.questionLengths[i];
            } else {
                allSelected = false;
            }
        }
        this.numSelected = numSelected;

        if (numSelected > 0) {
            this.dropdownTitle.style.color = "white";
            this.dropdownCount.style.color = "white";
            this.dropdownCount.innerText = `${numSelected} selected`;
        } else {
            this.dropdownTitle.style.color = "gray";
            this.dropdownCount.style.color = "gray";
            this.dropdownCount.innerText = `${numSelected} selected`;
        }

        if (allSelected) {
            this.sallBtn.classList.add("active");
            this.sallBtn.innerText = "Selected All";
        } else {
            this.sallBtn.classList.remove("active");
            this.sallBtn.innerText = "Select All";
        }
    }

    toggle_dropdown() {
        // Returns the change in questions selected
        this.dropdownToggled = !this.dropdownToggled;
        if (this.dropdownToggled) {
            this.dropdownBtn.innerText = "-";
            this.topicsDiv.style.maxHeight = `${this.topicsDiv.scrollHeight}px`;
        } else {
            this.dropdownBtn.innerText = "+";
            this.topicsDiv.style.maxHeight = null;
        }
    }

    select_all() {
        for (let idx = 0; idx < this.numTopics; idx++) {
            this.selected[idx] = true;
            this.topicElements[idx][0].classList.add("active");
            this.topicElements[idx][1].style.color = "white";
        }

        this.render();
    }

    deselect_all() {
        for (let idx = 0; idx < this.numTopics; idx++) {
            this.selected[idx] = false;
            this.topicElements[idx][0].classList.remove("active");
            this.topicElements[idx][1].style.color = "gray";
        }

        this.render();
    }

    toggle_topic(idx) {
        this.selected[idx] = !this.selected[idx];
        if (this.selected[idx]) {
            this.topicElements[idx][0].classList.add("active");
            this.topicElements[idx][1].style.color = "white";
        } else {
            this.topicElements[idx][0].classList.remove("active");
            this.topicElements[idx][1].style.color = "gray";
        }

        this.render();
    }

    get_topics() {
        let res = [];
        for (let idx = 0; idx < this.numTopics; idx++) {
            if (this.selected[idx]) {
                res = res.concat(this.topics[idx]);
            }
        }

        return res;
    }

    disable_all_btns() {
        this.sallBtn.setAttribute("disabled", "");
        for (let ele of this.topicElements) {
            ele[0].setAttribute("disabled", "true");
        }
    }
}

const MMNS_WRAPPER_DIV = document.getElementById("mainmenu_newsession_wrapper");
const MMNS_SUBJECT_DROPDOWN = document.getElementById("mmns_subject_dropdown");
const MMNS_CANCEL_BTN = document.getElementById("mmns_cancel_btn");
const MMNS_CREATE_BTN = document.getElementById("mmns_create_btn");

const MMNS_TS_TITLE = document.getElementById("mmns_ts_title");
const MMNS_TS_SUBTITLE = document.getElementById("mmns_ts_subtitle");
const MMNS_QCOUNT = document.getElementById("mmns_qcount");

const MMNS_TS_DIV = document.getElementById("mmns_topic_select_div");

var MMNS_TS_MENU_ELEMENTS = [];

function clear_mmns_ts_div() {
    MMNS_TS_TITLE.style.color = "gray";
    MMNS_TS_SUBTITLE.style.color = "gray";
    MMNS_TS_SUBTITLE.innerText = "Select a subject first!";

    MMNS_TS_DIV.innerHTML = "";
    MMNS_TS_MENU_ELEMENTS = [];

    MMNS_QCOUNT.innerText = `0`;
}

function build_mmns_ts_div(subject) {
    MMNS_TS_TITLE.style.color = "white";
    MMNS_TS_SUBTITLE.innerText = ``;

    MMNS_TS_DIV.innerHTML = "";
    MMNS_TS_MENU_ELEMENTS = [];

    let subjPresets = PRESETS[subject];
    let idx = 0;
    for (let preset of Object.entries(subjPresets)) {
        let menuEle = new PresetMenuElement(subject, preset[0], idx++);
        MMNS_TS_MENU_ELEMENTS.push(menuEle);
        menuEle.firstrender();
    }

    update_mmns_session();
}

function update_mmns_session() {
    let totalCount = 0;
    for (let ele of MMNS_TS_MENU_ELEMENTS) {
        totalCount += ele.numSelected;
    }

    if (totalCount > 0) {
        MMNS_CREATE_BTN.removeAttribute("disabled");
    } else {
        MMNS_CREATE_BTN.setAttribute("disabled", true);
    }
    
    MMNS_QCOUNT.innerText = `${totalCount}`;
}

function reset_mmns_div() {
    clear_mmns_ts_div();

    set_dropdown(MMNS_SUBJECT_DROPDOWN, Object.entries(SUBJECTS));
    MMNS_CANCEL_BTN.removeAttribute("disabled");
    MMNS_CANCEL_BTN.onclick = async function() {
        MMNS_CANCEL_BTN.setAttribute("disabled", "");
        MMNS_CREATE_BTN.setAttribute("disabled", "");
        reset_mm_div();
        await fadeout_mmns_div();
        await fadein_mm_div();
    }
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
        build_mmns_ts_div(subject);
    }
}

function hide_mmns_div() { MMNS_WRAPPER_DIV.style.display = "none"; }
function show_mmns_div() { MMNS_WRAPPER_DIV.style.display = "flex"; }

async function fadein_mmns_div() { return fade_in_element(MMNS_WRAPPER_DIV, "basic_fadein", "flex", 200); }
async function fadeout_mmns_div() { return fade_out_element(MMNS_WRAPPER_DIV, "basic_fadeout", 200); }

async function create_new_session() {
    let subject = MMNS_SUBJECT_DROPDOWN.value;
    let topics = [];
    for (let ele of MMNS_TS_MENU_ELEMENTS) {
        ele.disable_all_btns();
        topics = topics.concat(ele.get_topics());
    }

    MMNS_CANCEL_BTN.setAttribute("disabled", "");
    MMNS_CREATE_BTN.setAttribute("disabled", "");
    CURRENT_SESSION = new TriviaSession();
    CURRENT_SESSION.load_settings(undefined); // TODO
    CURRENT_SESSION.build(subject, topics);

    await fade_out_element(MMNS_WRAPPER_DIV, "basic_fadeout", 200);
    CURRENT_SESSION.firstrender();
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
    let session = load_data("rapidfire_session");

    if (session.inSession) { MENU_BTN_RESUME.removeAttribute("disabled"); } 
    else { MENU_BTN_RESUME.setAttribute("disabled", ""); }

    MENU_BTN_RESUME.onclick = resume_session;
    MENU_BTN_NS.removeAttribute("disabled");
    MENU_BTN_NS.onclick = async function() {
        reset_mmns_div();
        MENU_BTN_NS.setAttribute("disabled", "");
        await fadeout_mm_div();
        await fadein_mmns_div();
    };
    MENU_BTN_SETTINGS.onclick = async function() {
        await open_settings_div();
    }
}

function hide_mm_div() { MAINMENU_DIV.style.display = "none"; }
function show_mm_div() { MAINMENU_DIV.style.display = "flex"; }

async function fadein_mm_div() { return fade_in_element(MAINMENU_DIV, "basic_fadein", "flex", 200); }
async function fadeout_mm_div() { return fade_out_element(MAINMENU_DIV, "basic_fadeout", 200); }

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
    await fade_out_element(LOADING_DIV, "long_fadeout", 300);

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
    await fade_in_element(MAINMENU_DIV, "long_fadein", "flex", 300)
}

window.onload = async function() {
    setup_storage();

    LD_ERRORS = await load_directory();
    if (LD_ERRORS.length > 0) { LD_WARNING_QSET = true; };
    if (window.innerWidth < 800 || navigator.userAgent.match(/Mobile/i) != null) { LD_WARNING_MOBILE = true; }
    
    attempt_load_mm();
    setup_settings_div();
}
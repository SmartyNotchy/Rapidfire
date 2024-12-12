const DIRECTORY = {
    /*"APUSH": {
        "plaintext": "APUSH",
        "path": "./questions/apush/",
        "files": [
            "unit1", "unit2", "unit3", "unit4", "unit5", "unit6", "unit7", "unit8"
        ]
    },*/
    "NSL": {
        "plaintext": "AP NSL/AP Gov.",
        "path": "./questions/nsl/",
        "files": [
            "u1ch1", "u1ch2", "u1ch3", "u2ch4", "u2ch5", "u2ch6"
        ]
    },
    "ESS": {
        "plaintext": "Adv. Earth & Space Systems",
        "path": "./questions/ess/",
        "files": [
            "ch3", "ch4"
        ]
    },
    "Bio": {
        "plaintext": "Adv. Biology",
        "path": "./questions/bio/",
        "files": [
            "01_water", "02_carbs", "03_lipids"
        ]
    },
    "Span4": {
        "plaintext": "Spanish 4 (MD Curriculum)",
        "path": "./questions/span4/",
        "files": [
            "bellasarte"
        ]
    }
    /*"DEBUG": {
        "plaintext": "Debug Question Sets",
        "path": "../questions/debug/",
        "files": ["debug"]
    }*/
}

var SUBJECTS = {"None": "-----------------------"}; // Used for dropdown
var PRESETS = {"None": "-----------------------"}; // Used for dropdown
var QUESTION_BANK = {}; // Subject: {Topic: [Question, Question, ...]}

function trim_lower(str) {
    return str.trim().toLowerCase();
}

function format_markdown_text(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // Bold: **text**
        .replace(/\*(.*?)\*/g, '<em>$1</em>')               // Italic: *text*
        .replace(/\\n/g, '<br>');                            // Newline: \n
}

function get_qset_lines(filePath) {
    // Open & Read .txt File
    const content = fetch(filePath).then(response => {
        if (!response.ok) {
            console.error("Fetch operation wasn't an OK Response: " + filePath);
            throw new Error(`[NETWORK] Error while fetching file`);
        }
        return response.text();
    }).then(text => {
        const lines = text.split("\n").map(line => format_markdown_text(line.trim()));
        return lines;
    }).catch(error => {
        console.error(`Error while fetching ${filePath}: ${error}`);
        throw new Error(`[NETWORK] Error while parsing file`)
    });

    return content;
}

function parse_qset_line(str) {
    // Matches things in the pattern [IDENTIFIER] content
    const regex = /^\[([^\]]+)\]\s*(.*)$/;
    const match = str.match(regex);
    
    if (match) {
        return [match[1], match[2]];
    } else {
        return [null, null];
    }
}

function parse_qset_lines(lines) {
    let PRESET_NAME = undefined;
    let PRESET_TOPICS = [];
    let TOPICS = {};
    let currentTopic = undefined;

    let currentQType = undefined;
    let currentQObj = undefined;
    let currentlyParsingQ = false;

    let lineNum = 0;

    for (let line of lines) {
        lineNum += 1;
        line = parse_qset_line(line);
        if (line[0] == null) {
            continue;
        }

        if (currentlyParsingQ) {
            if (line[0] == "END") {
                if (!PRESET_TOPICS.includes(currentTopic)) {
                    PRESET_TOPICS.push(currentTopic);
                    TOPICS[currentTopic] = [];
                }
                TOPICS[currentTopic].push(currentQObj);
                
                currentQType = undefined;
                currentQObj = undefined;

                currentlyParsingQ = false;
            } else {
                if (currentQType == "SAQ") {
                    if (line[0] == "A" || line[0] == "EXA") { // TODO FIX
                        currentQObj.correctAnswers.push(line[1]);
                    } else if (line[0] != "T" && line[0] != "EXP") { // TODO FIX
                        throw new Error(`[PARSE] Line ${lineNum}: Unrecognized identifier "${line[0]}" (with arg "${line[1]}")`);
                    }
                } else if (currentQType == "MCQ") {
                    if (line[0] == "CA") {
                        currentQObj.correctAnswer = line[1];
                    } else if (line[0] == "WA") {
                        currentQObj.wrongAnswers.push(line[1]);
                    } else if (line[0] == "NS" || line[0] == "EXP") {
                        // TODO
                    } else {
                        throw new Error(`[PARSE] Line ${lineNum}: Unrecognized identifier "${line[0]}" (with arg "${line[1]}")`);
                    }
                }
            }           
        } else {
            if (line[0] == "PRESET") {
                if (PRESET_NAME != undefined) {
                    throw new Error(`[PARSE] Line ${lineNum}: Preset name already defined (${PRESET_NAME})`);
                }
                PRESET_NAME = line[1];
            } else if (line[0] == "T") {
                currentTopic = line[1];
            } else if (line[0] == "SAQ") {
                currentQType = "SAQ";
                currentQObj = new SAQQuestion(line[1], currentTopic, []);
                currentlyParsingQ = true;
            } else if (line[0] == "MCQ") {
                currentQType = "MCQ";
                currentQObj = new MCQQuestion(line[1], currentTopic, [], []);
                currentlyParsingQ = true;
            } else {
                throw new Error(`[PARSE] Line ${lineNum}: Unrecognized identifier "${line[0]}" (with arg "${line[1]}")`);
            }
        }
    }

    return [PRESET_NAME, PRESET_TOPICS, TOPICS];
}

async function load_directory() {
    let idx = 0;
    let numSets = Object.entries(DIRECTORY).map(subj => subj[1]["files"].length).reduce((acc, item) => acc + item, 0);
    let errors = [];

    for (let subj of Object.entries(DIRECTORY)) {
        SUBJECTS[subj[0]] = subj[1]["plaintext"];

        let subjPresets = {};
        let subjTopics = {};
        let filepath = subj[1]["path"];

        for (let filename of subj[1]["files"]) {
            idx++;
            LD_INITIAL_TITLE.innerText = `Loading Question Sets (${idx}/${numSets})`;

            try {
                let lines = await get_qset_lines(`${filepath}${filename}.txt`);
                let res = parse_qset_lines(lines);

                subjPresets[res[0]] = res[1]
                subjTopics = { ...subjTopics, ...res[2] };
            } catch (error) {
                errors.push(`${filepath}${filename}.txt - ` + error.message);
            }
        }

        PRESETS[subj[0]] = subjPresets;
        QUESTION_BANK[subj[0]] = subjTopics;
    }
    return errors;
}
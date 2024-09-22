const DIRECTORY = {
    "APUSH": {
        "plaintext": "APUSH",
        "path": "../questions/apush/",
        "files": [
            "unit1", "unit2", "unit3", "unit4", "unit5", "unit6", "unit7", "unit8"
        ]
    },
    "NSL": {
        "plaintext": "AP NSL/AP Gov.",
        "path": "../questions/nsl/",
        "files": [
            "u1ch1", "u1ch2", "u1ch3"
        ]
    },
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

function get_qset_lines(filePath) {
    // Open & Read .txt File
    const content = fetch(filePath).then(response => {
        if (!response.ok) {
            console.error("Fetch operation wasn't an OK Response: " + filePath);
            throw new Error(`[NETWORK] Error while fetching file`);
        }
        return response.text();
    }).then(text => {
        const lines = text.split("\n").map(line => line.trim());
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

    let currentQType = undefined;
    let currentQTopic = undefined;
    let currentQObj = undefined;
    let currentlyParsingQ = false;

    for (let line of lines) {
        line = parse_qset_line(line);
        if (line[0] == null) {
            continue;
        }

        if (currentlyParsingQ) {
            if (line[0] == "Q") {
                currentQObj.q = line[1];
            } else if (line[0] == "T") {
                currentQTopic = line[1];
                currentQObj.topic = currentQTopic;
            } else if (line[0] == "END") {
                if (!PRESET_TOPICS.includes(currentQTopic)) {
                    PRESET_TOPICS.push(currentQTopic);
                    TOPICS[currentQTopic] = [];
                }
                TOPICS[currentQTopic].push(currentQObj);
                
                currentQType = undefined;
                currentQTopic = undefined;
                currentQObj = undefined;

                currentlyParsingQ = false;
            } else {
                if (currentQType == "SAQ") {
                    if (line[0] == "A" || line[0] == "EXA") { // TODO FIX
                        currentQObj.correctAnswers.push(line[1]);
                    } else  {
                        throw new Error(`[PARSE] Unrecognized identifier "${line[0]}" (with arg "${line[1]}")`);
                    }
                } else if (currentQType == "MCQ") {
                    if (line[0] == "CA") {
                        currentQObj.correctAnswer = line[1];
                    } else if (line[0] == "WA") {
                        currentQObj.wrongAnswers.push(line[1]);
                    } else if (line[0] == "NS") {
                        // TODO
                    }
                }
            }           
        } else {
            if (line[0] == "PRESET") {
                if (PRESET_NAME != undefined) {
                    throw new Error(`[PARSE] Preset name already defined (${PRESET_NAME})`);
                }
                PRESET_NAME = line[1];
            } else if (line[0] == "QT") {
                currentQType = line[1];
                currentlyParsingQ = true;
                if (currentQType == "SAQ") {
                    currentQObj = new SAQQuestion(undefined, undefined, []);
                } else if (currentQType == "MCQ") {
                    currentQObj = new MCQQuestion(undefined, undefined, [], []);
                } else {
                    throw new Error(`[PARSE] Unrecognized question type "${line[1]}"`);
                }
            } else {
                throw new Error(`[PARSE] Unrecognized identifier "${line[0]} (with arg "${line[1]}")"`);
            }
        }
    }

    return [PRESET_NAME, PRESET_TOPICS, TOPICS];
}

async function load_directory() {
    for (let subj of Object.entries(DIRECTORY)) {
        SUBJECTS[subj[0]] = subj[1]["plaintext"];

        let subjPresets = {};
        let subjTopics = {};
        let filepath = subj[1]["path"];

        for (let filename of subj[1]["files"]) {
            try {
                let lines = await get_qset_lines(`${filepath}${filename}.txt`);
                let res = parse_qset_lines(lines);

                subjPresets[res[0]] = res[1]
                subjTopics = { ...subjTopics, ...res[2] };
            } catch (error) {
                console.error(error);
                // TODO: DISPLAY ERRORS
            }
        }

        PRESETS[subj[0]] = subjPresets;
        QUESTION_BANK[subj[0]] = subjTopics;
    }
    console.log("Finished!");
    return true;
}
import { EVENT_CODES, IGNORABLE_EVENTS, IMAGE_EVENTS, COLORS } from './events'
import { READABLE_SITUATIONS } from './situations'
import { CHARACTERS } from './characters'

const sprintf = require('sprintf-js').sprintf;
const _ = require('underscore');


var UNREFINED_EVENTS = {
    Mkh: "Marking",
    Mkn: "Marking",
    Mkl: "Marking",
    ATb: "Action",
    ATn: "Action",
    ATg: "Action",
    ATi: "Action",
    ATc: "Action",
    STf: "Seduction",
    GLD: "Delegate",
    FAg: "Fingerprint",
    FAb: "Fingerprint",
    FAG: "Fingerprint",
    FAf: "Fingerprinted",
    MWc: "Complete",
    ChT: "Timeadd",
    BAc: "Casting",
    BAC: "Casting",
    DAp: "Casting",
    DAQ: "Casting",
    DAP: "Casting",
    STc: "Casting",
    STQ: "Casting",
    SPc: "Casting",
    SPC: "Casting",
    Snp: "Shot",
    SnS: "Shot",
    Sns: "Shot",
    SSg: "Statue",
    Brp: "Briefcase",
    DRg: "Drink",
    DBg: "Drink",
    BTg: "Book"


};

var AI_EVENTS = new Set([
    "DRs",
    "DRC",
    "DRS",
    "DRg",
    "DRr",
    "DRR",
    "DRo",
    "DRX",
    "DRG",
    "DBg",
    "DBr",
    "DBR",
    "DBD",
    "DBo",
    "DBX",
    "DBG",
    "DBx",
    "DBc"
]);

export class Journal {

    constructor(data, raw) {
        this.gameType = data['ActiveGameType'];
        this.events = _.filter(data['events'], (it) => !IGNORABLE_EVENTS.has(it['Event3CC']));
        this.missions = data['missions'];
        this.objects = data['objects'];
        this.situations = data['situations'];
        this.journal = data['spyparty_journal'];
        this.raw = raw;
        this.end_game_hl = [];
        this.end_game_ll = [];
        this.spy = this._getCharacterFromEvent("SPC", "SPc");
        this.timeline = this._filterTimeline();
    }

    /* private */ _filterTimeline() {
        return _.filter(this.events, (it) => {
            var eventCode = it['Event3CC'];
            return !(AI_EVENTS.has(eventCode) && (CHARACTERS[this._getCharacterFromObjectId(it['ObjectID'])] !== this.spy));
        });
    }

    /* private */ _getCharacterFromObjectId(objectId) {
        return _.filter(this.objects, (it) => {
            return it['ID'] === objectId;
        })[0]['filehash'];
    }

    /* private */ _getCharacterFromEvent(event1, event2) {
        var objectIdPotentials = _.filter(this.events, (it) => {
            return it['Event3CC'] === event1 || it['Event3CC'] === event2;
        });

        if (objectIdPotentials.length === 0) {
            return undefined;
        }

        var objectHash = _.filter(this.objects, (it) => {
            return it['ID'] === objectIdPotentials[0]['ObjectID'];
        })[0]['filehash'];

        return CHARACTERS[objectHash];
    };

    getSpy() {
        return this.spy;
    }

    getDoubleAgent() {
        return this._getCharacterFromEvent("DAp", "DAQ");
    }

    getSeductionTarget() {
        return this._getCharacterFromEvent("STc", "STQ");
    }

    getAmbassdaor() {
        return this._getCharacterFromEvent("BAc", "BAC");
    }

    /* private */ _genCharacterObject(character) {
        var cssClass = "image";
        var sortWeight = 10;

        if (character === this.spy) {
            cssClass = "image image--spy-border";
            sortWeight = 0;
        } else if (character === this.getDoubleAgent) {
            cssClass = "image image--da-border";
            sortWeight = 2;
        } else if (character === this.getAmbassdaor) {
            cssClass = "image image--amba-border";
            sortWeight = 1;
        } else if (character === this.getSeductionTarget) {
            cssClass = "image image--st-border";
            sortWeight = 3;
        } else if (character === "Toby" || character === "Damon") {
            cssClass = "image image--other-border";
        }


        return {
            character: character,
            cssClass: cssClass,
            sortWeight: sortWeight
        }
    }

    /* private */ _removeLights(character) {
        this.end_game_hl = this.end_game_hl.filter((it) => it['character'] !== character['character']);
        this.end_game_ll = this.end_game_ll.filter((it) => it['character'] !== character['character']);
    }

    /* private */ _refineMark(event, minutes, seconds) {
        var character = this._genCharacterObject(CHARACTERS[this._getCharacterFromObjectId(event['ObjectID'])]);
        var eventCode = event['Event3CC'];


        var color =  COLORS[event['Event3CC']];

        if (eventCode === 'Mkh') { //hl
            this._removeLights(character);
            this.end_game_hl.push(character);
        } else if (eventCode === 'Mkn') { //neutral
            this._removeLights(character);
        } else if (eventCode === 'Mkl') { //ll
            this._removeLights(character);
            this.end_game_ll.push(character);
        }

        var eventText = EVENT_CODES[event['Event3CC']];
        if (character === this.spy) {
            eventText = sprintf(eventText, "spy ");
            color = "#870D00";
        } else {
            eventText = sprintf(eventText, "");
        }

        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: character['character'],
            style: {
                'color': color,
                'font-size': '18px',
                'font-weight': 'bold'
            }
        };
    }

    /* private */ _refineAction(event, minutes, seconds) {
        var situation = READABLE_SITUATIONS[this.situations[parseInt(event['Situation'])]];
        var eventText = sprintf(EVENT_CODES[event['Event3CC']], situation);

        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: undefined,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineSeduction(event, minutes, seconds) {
        var value = parseInt(event['Value']) || 101;
        var eventText = sprintf(EVENT_CODES[event['Event3CC']], value);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: undefined,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineFingerprint(event, minutes, seconds, object) {
        var eventText = sprintf(EVENT_CODES[event['Event3CC']], object);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: undefined,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineTimeAdd(event, minutes, seconds) {
        var timeAdded = 45; /* THIS IS LIKELY TO CHANGE */

        var eventText = sprintf(EVENT_CODES[event['Event3CC']], timeAdded);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: undefined,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineDelegatePurloin(event, minutes, seconds) {
        var character = CHARACTERS[this._getCharacterFromObjectId(event['ObjectID'])];

        var eventText = sprintf(EVENT_CODES[event['Event3CC']], character);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: character,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineMissionsComplete(event, minutes, seconds) {
        var countdown = 10;
        var eventText = sprintf(EVENT_CODES[event['Event3CC']], countdown);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: undefined,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineCasting(event, minutes, seconds) {
        var character = CHARACTERS[this._getCharacterFromObjectId(event['ObjectID'])];

        var eventText = sprintf(EVENT_CODES[event['Event3CC']], character);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: character,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _refineShot(event, minutes, seconds) {
        var character;
        if (!event.hasOwnProperty("ObjectID")) {
            character = undefined;
        } else {
            character = CHARACTERS[this._getCharacterFromObjectId(event['ObjectID'])];
        }

        var eventText = sprintf(EVENT_CODES[event['Event3CC']], character);
        return {
            line: sprintf("%02d:%04.1f -- %s", minutes, seconds, eventText),
            image: character,
            style: {
                'color': COLORS[event['Event3CC']],
                'font-size': '18px',
                'font-weight': 'bold'
            }
        }
    }

    /* private */ _getGameTimeFromEvent(event) {
        if (parseInt(this.journal['JournalVersion']) < 10) {
            return event['GameTimestamp'];
        } else {
            return event['GameTime'];
        }
    }

    getTimeline () {
        var original_duration = parseFloat(this.journal['OriginalGameDuration']);
        var current_object = undefined; // hack because fingerprint events don't have proper object IDs

        return this.timeline.map((it) => {
            var game_time = original_duration - this._getGameTimeFromEvent(it);
            var minutes = game_time / 60;
            var seconds = Math.abs(game_time % 60);
            var eventCode = it['Event3CC'];


            if (UNREFINED_EVENTS.hasOwnProperty(eventCode)) {
                var type = UNREFINED_EVENTS[eventCode];
                if (type === "Marking") {
                    return this._refineMark(it, minutes, seconds);
                } else if (type === "Action") {
                    return this._refineAction(it, minutes, seconds);
                } else if (type === "Seduction") {
                    return this._refineSeduction(it, minutes, seconds);
                } else if (type === "Timeadd") {
                    original_duration += 45;
                    return this._refineTimeAdd(it, minutes, seconds);
                } else if (type === "Delegate") {
                    return this._refineDelegatePurloin(it, minutes, seconds);
                } else if (type === "Complete") {
                    return this._refineMissionsComplete(it, minutes, seconds);
                } else if (type === "Casting") {
                    return this._refineCasting(it, minutes, seconds);
                } else if (type === "Shot") {
                    return this._refineShot(it, minutes, seconds);
                } else if (type === "Drink") {
                    current_object = "drink";
                } else if (type === "Briefcase") {
                    current_object = "briefcase";
                } else if (type === "Statue") {
                    current_object = "statue";
                } else if (type === "Book") {
                    current_object = "book";
                } else if (type === "Fingerprint" || type === "Fingerprinted") {
                    return this._refineFingerprint(it, minutes, seconds, current_object);
                }
            }




            return {
                line: sprintf("%02d:%04.1f -- %s", minutes, seconds, EVENT_CODES[it['Event3CC']]),
                image: undefined,
                style: {
                    'color': COLORS[it['Event3CC']],
                    'font-size': '18px',
                    'font-weight': 'bold'
                }
            }

        });
    }
}

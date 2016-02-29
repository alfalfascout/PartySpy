const _ = require('underscore');
const sprintf = require('sprintf-js').sprintf;

var BANNED_FIELDS = ['GL_RENDERER',
    'GL_VENDOR',
    'GL_VERSION',
    'Adapter',
    'MachineName',
    'MachineUserName',
    'WindowHeight',
    'WindowWidth'];

var LIST_GROUPS = ['objects', 'missions', 'event'];

export class JournalParser {


    filterDataKeys(title) {
        var keys = [];
        for (var key in this.parsed) {
            if (this.parsed.hasOwnProperty(key) && key.startsWith(title) && !key.endsWith('s')) {
                keys.push(key);
            }
        }

        return keys;
    }

    constructor(data) {
        this.data = data;
        this.parseStageOne();
        this.parseStageTwo();
        console.log(this.parsed);
    }

    parseStageTwo() {
        // event, mission, object
        var eventKeys = this.filterDataKeys('event');
        var objectKeys = this.filterDataKeys('object');
        var missionKeys = this.filterDataKeys('mission');

        eventKeys.sort();
        objectKeys.sort();
        missionKeys.sort();

        this.parsed.events = [];
        eventKeys.forEach((it) => {
            this.parsed.events.push(this.parsed[it]);
            delete this.parsed[it];
        });

        this.parsed.objects = [];
        objectKeys.forEach((it) => {
            this.parsed.objects.push(this.parsed[it]);
            delete this.parsed[it];
        });

        this.parsed.missions = [];
        missionKeys.forEach((it) => {
            this.parsed.missions.push(this.parsed[it]);
            delete this.parsed[it];
        });

        this.parsed.situations = [
            "debug_situation",
            "sniped",
            "drinks",
            "briefcase",
            "bookcase",
            "pedestal",
            "looking",
            "conversation",
            "guarding",
            "serving",
            "bug_ambassador",
            "double_agent",
            "transfer_microfilm",
            "swap_statue",
            "inspect_statues",
            "seduction",
            "purloin_guestlist",
            "check_watch",
            "window",
            "painting",
            "fingerprint_ambassador",
            "bartending"
        ];

        //delete banned fields
        BANNED_FIELDS.forEach((it) => {
           delete this.parsed['spyparty_journal'][it];
        });

        delete this.parsed['CPUIDs'];

    }

    parseStageOne() {
        this.parsed = {};
        this.group = [];

        this.counter = 0;

        var lines = this.data.split('\n');
        lines.forEach((it) => {
            var tokens = it.trim().split(" ");
            if (tokens[0] === 'group') {
                this.group.push(tokens[1]);
                this.parsed[tokens[1]] = {};
                return;
            } else if (tokens[0] === 'groups') {
                var objName = sprintf("%s%04d", tokens[1], this.counter++);
                this.group.push(objName);
                this.parsed[objName] = {};
                return;
            }

            if (tokens[0] === '}') {
                this.group.pop();
            }

            if (tokens.length < 2)
                return;

            this.parsed[this.group[this.group.length - 1]][tokens[1]] = tokens.slice(3, tokens.length).join("").replace(/"/g, "");;


        });
    };
}

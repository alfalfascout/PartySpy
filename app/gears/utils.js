import jetpack from 'fs-jetpack';
import { remote } from 'electron';

const sprintf = require('sprintf-js').sprintf;

var MODE_MAP = {
    0: 'Known',
    1: 'Pick',
    2: 'Any'
};

export var getVersionNumber = function() {
    var app = remote.app;
    var appDir = jetpack.cwd(app.getAppPath());
    return appDir.read('package.json', 'json').version;
};

export var MAP_LIST = ["Beginner v. Beginner High-Rise",
    "Beginner v. Beginner Ballroom",
    "New Art Ballroom",
    "High-Rise",
    "Gallery",
    "Courtyard 2",
    "Panopticon",
    "Veranda",
    "Balcony",
    "Crowded Pub",
    "Pub",
    "Old Ballroom",
    "Courtyard 1",
    "Double Modern",
    "Modern"];

export var parseString = function(data) {
    return String.fromCharCode.apply(null, data);
};

export var unpackInt = function(data) {
    //assert(data.length == 4);

    return data[0] | data[1] << 8 | data[2] << 16 | data[3] << 24;
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0});
};

export var generateMissionObject = function(replay) {
    var unavailbleMissions = replay["unavailableMissions"] || [];
    var completedMissions = replay["completedMissions"];
    var uncompletedMissions = replay["selectedMissions"].diff(completedMissions);
    var unselectedMissions = unpackMissions(0xFF).diff(unavailbleMissions).diff(replay["selectedMissions"]);


    return {
        unavailable: unavailbleMissions,
        completed: completedMissions,
        uncompleted: uncompletedMissions,
        disabled: unselectedMissions
    };
};

export var unpackMissions = function(data) {
    var missions = [];
    if (data & (1 << 0))
        missions.push("Bug Ambassador");
    if (data & (1 << 1))
        missions.push("Contact Double Agent");
    if (data & (1 << 2))
        missions.push("Transfer Microfilm");
    if (data & (1 << 3))
        missions.push("Swap Statue");
    if (data & (1 << 4))
        missions.push("Inspect Statues");
    if (data & (1 << 5))
        missions.push("Seduce Target");
    if (data & (1 << 6))
        missions.push("Purloin Guest List");
    if (data & (1 << 7))
        missions.push("Fingerprint Ambassador");
    return missions;
};

export var unpackFloat = function(data) {
    data = unpackInt(data);
    var sign = (data & 0x80000000) ? -1 : 1;
    var exponent = ((data >> 23) & 0xFF) - 127;
    var significand = (data & ~(-1 << 23));

    if (exponent == 128)
        return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);

    if (exponent == -127) {
        if (significand == 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else significand = (significand | (1 << 23)) / (1 << 23);

    return sign * significand * Math.pow(2, exponent);
};

export var unpackMissionType = function(data) {
    data = unpackInt(data);

    var mode = MODE_MAP[data >> 28];
    var available = (data & 0x0FFFC000) >> 14;
    var required = data & 0x00003FFF;

    if (mode === 'Known') {
        return 'Known ' + required;
    }

    return sprintf('%s %d of %d', mode, required, available);
};

export var getWinner = function(item){
    if (item.result === "Incomplete")
        return undefined;
    if (item.result === "Missions Win" || item.result === "Civilian Shot") {
        return item.spy;
    } else {
        return item.sniper;
    }
};
export var getLoser = function(item){
    if (item.result === "Incomplete")
        return undefined;
    if (item.result === "Missions Win" || item.result === "Civilian Shot") {
        return item.sniper;
    } else {
        return item.spy;
    }
};

export var isOurGame = function(item, username) {
    return item.spy === username || item.sniper === username;
};

export var isIncomplete = function(item) {
    return item.result === 'Incomplete';
};

import { parseString, unpackInt, unpackMissions, unpackFloat, unpackMissionType } from './utils'
import { UNAVAILABLE_MISSIONS } from './level'

const sprintf = require('sprintf-js').sprintf;
const binary = require('binary');
const uuid = require('node-uuid');
const moment = require('moment');

var RESULT_MAP = {
    0: "Missions Win",
    1: "Spy Time Out",
    2: "Spy Shot",
    3: "Civilian Shot",
    4: "Incomplete"
};

var LEVEL_MAP = {
    "0x3A30C326": "Beginner v. Beginner High-Rise",
    "0x5996FAAA": "Beginner v. Beginner Ballroom",
    "0x5B121925": "New Art Ballroom", //works
    "0x1A56C5A1": "High-Rise",  //works
    "0x28B3AA5E": "Gallery",
    "0x290A0C75": "Courtyard 2",  //works
    "0x3695F583": "Panopticon",
    "0x-57415F6F": "Veranda",
    "0x-4776E044": "Balcony",
    "0xD027340": "Crowded Pub",
    "0x3B85FFF3": "Pub",
    "0x9C2E7B0": "Old Ballroom",
    "0x-4B309795": "Courtyard 1",
    "0x7076E38F": "Double Modern",
    "0x-C19EB9F": "Modern"
};

export var parseVersion3 = function(filename, data) {
    var spyNameLength = data[0x2E];
    var sniperNameLength = data[0x2F];

    var spyName = parseString(data.slice(0x50, 0x50 + spyNameLength));
    var sniperName = parseString(data.slice(0x50 + spyNameLength, 0x50 + spyNameLength + sniperNameLength));

    var result = RESULT_MAP[data[0x30]];

    var completedMissions = unpackMissions(unpackInt(data.slice(0x44, 0x48)));
    var selectedMissions = unpackMissions(unpackInt(data.slice(0x3C, 0x3C + 4)));
    var pickedMission = unpackMissions(unpackInt(data.slice(0x40, 0x40 + 4)));

    var levelId = unpackInt(data.slice(0x38, 0x38 + 4));

    var level = LEVEL_MAP[sprintf("0x%X", levelId)];

    if (level == undefined) {
        console.log(sprintf("0x%X", levelId));
        return undefined;
    }

    var gameStartTime = unpackInt(data.slice(0x28, 0x28 + 4));

    var duration = unpackFloat(data.slice(0x14, 0x14 + 4));

    var missionType = unpackMissionType(data.slice(0x34, 0x34 + 4));

    var uuidByteArray = data.slice(0x18, 0x18 + 16);
    var uuid = sprintf("%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
        uuidByteArray[0],
        uuidByteArray[1],
        uuidByteArray[2],
        uuidByteArray[3],
        uuidByteArray[4],
        uuidByteArray[5],
        uuidByteArray[6],
        uuidByteArray[7],
        uuidByteArray[8],
        uuidByteArray[9],
        uuidByteArray[10],
        uuidByteArray[11],
        uuidByteArray[12],
        uuidByteArray[13],
        uuidByteArray[14],
        uuidByteArray[15]
    );



    return {
        filename: filename,
        spy: spyName,
        sniper: sniperName,
        level: level,
        result: result,
        completedMissions: completedMissions,
        selectedMissions: selectedMissions,
        pickedMissions: pickedMission,
        gameStartTime: gameStartTime,
        duration: Math.round(duration),
        missionType: missionType,
        uuid: uuid,
        unavailableMissions: UNAVAILABLE_MISSIONS[level],
        humanGameStartTime: moment(gameStartTime * 1000).format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
};


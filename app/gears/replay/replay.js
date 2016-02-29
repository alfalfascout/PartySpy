
import { parseString, unpackInt, unpackMissions } from '../utils'
import { parseVersion3 } from './version3parser'


Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0});
};

export class Replay {

    constructor(filename, data) {
        this.magicNumber = parseString(data.slice(0, 4));
        this.versionNumber = unpackInt(data.slice(4, 8));
        this.protocolVersion = unpackInt(data.slice(8, 12));
        this.spyPartyVersion = unpackInt(data.slice(12, 16));
        this.filename = filename;

        if (this.versionNumber == 3 || this.versionNumber == 2) {
            var parseResults = parseVersion3(filename, data);
            this.spy = parseResults['spy'];
            this.sniper = parseResults['sniper'];
            this.level = parseResults['level'];
            this.result = parseResults['result'];
            this.completedMissions = parseResults['completedMissions'];
            this.pickedMissions = parseResults['completedMissions'];
            this.gameStartTime = parseResults['gameStartTime'];
            this.duration = parseResults['duration'];
            this.missionType = parseResults['missionType'];
            this.uuid = parseResults['uuid'];
            this.unavailableMissions = parseResults['unavailableMissions'];
            this.humanGameStartTime = parseResults['humanGameStartTime'];
            this.selectedMissions = parseResults['selectedMissions'];
            this.uuidString = parseResults['uuidString'];
        }

    }

    isOurGame (username) {
        return this.spy === username || this.sniper === username;
    };

    getLoser() {
        if (this.result === "Incomplete")
            return undefined;
        if (this.result === "Missions Win" || this.result === "Civilian Shot") {
            return this.sniper;
        } else {
            return this.spy;
        }
    };

    getWinner() {
        if (this.result === "Incomplete")
            return undefined;
        if (this.result === "Missions Win" || this.result === "Civilian Shot") {
            return this.spy;
        } else {
            return this.sniper;
        }
    };

    isIncomplete() {
        return this.result === 'Incomplete';
    };

    generateMissionObject() {
        var unavailbleMissions = this.unavailableMissions || [];
        var completedMissions = this.completedMissions;
        var uncompletedMissions = this.selectedMissions.diff(completedMissions);
        var unselectedMissions = unpackMissions(0xFF).diff(unavailbleMissions).diff(this.selectedMissions);


        return {
            unavailable: unavailbleMissions,
            completed: completedMissions,
            uncompleted: uncompletedMissions,
            disabled: unselectedMissions
        };
    };
}

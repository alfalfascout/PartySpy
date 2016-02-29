import { MAP_LIST } from './utils'


_ = require('underscore');
$ = require('jquery');

export class Stats {
    constructor(username, replays) {
        this.username = username;
        this.replays = replays;
        this.mapStats = {};
        this.playerStats = {};

        MAP_LIST.forEach((it) => {
            this.mapStats[it] = {
                spyWins: 0,
                spyLoses: 0,
                sniperWins: 0,
                sniperLoses: 0
            };
        });
        this.parseReplays();
    }

    parseReplays() {
        for (var i = 0; i < this.replays.length; ++i) {
            this.parseReplay(this.replays[i]);
        }
    };

    parseReplay(replay) {
        if (!replay.isOurGame(this.username) || replay.isIncomplete())
            return;

        if (replay.level.startsWith("Unknown"))
            return;

        var winner = replay.getWinner();
        var loser = replay.getLoser();

        var ourRole = replay.spy === this.username ? "spy" : "sniper";
        var opponent = replay.spy === this.username ? replay.sniper : replay.spy;

        if (this.playerStats[opponent] == undefined) {
            this.playerStats[opponent] = {
                opponent: opponent,
                spyWins: 0,
                spyLoses: 0,
                sniperWins: 0,
                sniperLoses: 0
            }
        }

        if (ourRole === "spy" && winner === this.username) {
            this.mapStats[replay.level]['spyWins'] += 1;
            this.playerStats[opponent]['spyWins'] += 1;
        } else if (ourRole === "spy" && loser === this.username) {
            this.mapStats[replay.level]['spyLoses'] += 1;
            this.playerStats[opponent]['spyLoses'] += 1;
        } else if (ourRole === "sniper" && winner === this.username) {
            this.mapStats[replay.level]['sniperWins'] += 1;
            this.playerStats[opponent]['sniperWins'] += 1;
        } else if (ourRole === "sniper" && loser === this.username) {
            this.mapStats[replay.level]['sniperLoses'] += 1;
            this.playerStats[opponent]['sniperLoses'] += 1;
        }
    }

    getWinRate(wins, loses) {
        if (wins + loses == 0) return 0;
        return Math.round((wins / (wins + loses)) * 100)
    }

    getMapChartData() {
        var spyWinRates = [];
        var sniperWinRates = [];

        for (var i = 0; i < MAP_LIST.length; ++i) {
            var currMapStats = this.mapStats[MAP_LIST[i]];
            spyWinRates.push(this.getWinRate(currMapStats['spyWins'], currMapStats['spyLoses']));
            sniperWinRates.push(this.getWinRate(currMapStats['sniperWins'], currMapStats['sniperLoses']));
        }

        return {
            labels: MAP_LIST,
            series: ['Spy Win Rate', 'Sniper Win Rate'],
            data: [spyWinRates, sniperWinRates]
        };
    }

    getOpponentChartData() {
        var statList = _.values(this.playerStats);
        statList.sort(function(x, y) {
            if (x.opponent < y.opponent)
                return -1;
            if (x.opponent > y.opponent)
                return 1;

            return 0;
        });

        var labels = _.map(statList, (it) => it.opponent);
        var data = _.map(statList, (it) => this.getWinRate(it.spyWins + it.sniperWins, it.sniperLoses + it.spyLoses));

        return {
            labels: labels,
            data: data
        }

    };
}

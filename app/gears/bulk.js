import { getWinner, getLoser, isOurGame, isIncomplete } from './utils'


export var bulkAnalyze = function(replays, username) {
    var games = 0;
    var gamesWon = 0;

    var spyShotGames = 0;
    var civilianShotGames = 0;
    var timeOutGames = 0;
    var missionWinGames = 0;

    replays.forEach(function(item, index, list) {
        if (isOurGame(item, username) && !isIncomplete(item)) {
            games++;
            var winner = getWinner(item);

            if (winner === username) {
                ++gamesWon;
            }

            if (item.result === "Missions Win") {
                ++missionWinGames;
            } else if (item.result === "Spy Time Out") {
                ++timeOutGames;
            } else if (item.result === "Civilian Shot") {
                ++civilianShotGames;
            } else if (item.result === "Spy Shot") {
                ++spyShotGames;
            }
        }
    });



    return {
        games: games,
        gamesWon: gamesWon,
        gamesLost: games - gamesWon,
        spyShotGames: spyShotGames,
        civilianShotGames: civilianShotGames,
        missionWinGames: missionWinGames
    };


};

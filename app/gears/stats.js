import { getWinner, getLoser } from './utils'
import { Stats } from './stats2'

_ = require('underscore');
$ = require('jquery');

function DefaultDict() {
    this.get = function(key) {
        if (this.hasOwnProperty(key)) {
            return this[key];
        } else {
            return 0;
        }
    }
}

export var getStats = function(replays, username) {

    var level_wins = new DefaultDict();
    var level_losses = new DefaultDict();

    var user_wins = new DefaultDict();
    var user_losses = new DefaultDict();

    _.each(replays, function(it, index, list) {
        var winner = getWinner(it);
        var loser = getLoser(it);

        var level = it.level;

        if (winner === username) {
            level_wins[level] = level_wins.get(level) + 1;
            user_wins[loser] = user_wins.get(loser) + 1;
        } else {
            level_losses[level] = level_losses.get(level) + 1;
            user_losses[winner] = user_losses.get(winner) + 1;
        }
    });

    var overall_level = {};
    var overall_user = {};

    //TODO: fix when there are 0 wins or losses on a map
    $.each(level_wins, function(key, value) {
        var wins = value;
        var losses = level_losses[key];
        overall_level[key] = wins + "-" + losses;
    });

    $.each(user_wins, function(key, value) {
        var wins = value;
        var losses = user_losses[key];
        overall_user[key] = wins + "-" + losses;
    });

    delete overall_level['get'];
    delete overall_user['get'];

    return {
        level_wins: level_wins,
        level_losses: level_losses,
        level_record: overall_level,
        user_wins: user_wins,
        user_losses: user_losses,
        user_record: overall_user
    }
};

'use strict';

import { ReplayParser } from './replay_parser'
import { bulkAnalyze } from './bulk'
import { getStats } from './stats'
import { generateMissionObject, getWinner, getLoser, getVersionNumber  } from './utils'
import { Stats } from './stats2'
import { exportExcelData } from './excel'
import { getAwfulColor } from './tunemode'

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const remote = require('electron').remote;
const dialog = remote.require('electron').dialog;
const shell = remote.require('electron').shell;
const sprintf = require('sprintf-js').sprintf;


var parser = new ReplayParser();

var version = getVersionNumber;

function listFiles(startPath,filter){

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return [];
    }

    var files = fs.readdirSync(startPath);
    var filelist = [];
    for(var i = 0; i < files.length; i++){
        var filename = path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            filelist.push(listFiles(filename,filter)); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            filelist.push(filename);
        }
    }

    return filelist;
}

var startParse = function(filePath, username, callback) {
    var replayFiles = listFiles(filePath, '.replay');

    replayFiles = _.flatten(replayFiles);

    var replays = [];

    replayFiles.forEach(function(item, idx, list) {
        var data = fs.readFileSync(item);
        var replay = parser.parseFile(item, data);
        if (replay != undefined)
            replays.push(parser.parseFile(item, data));
    });


    var bulk = bulkAnalyze(replays, username);
    callback(replays, bulk);
};

var IMAGE_MAP = {
    "Beginner v. Beginner High-Rise": "bvbhighrise.png",
    "Beginner v. Beginner Ballroom": "bvbballroom.png",
    "New Art Ballroom": "ballroom.png",
    "High-Rise": "highrise.png",
    "Gallery": "gallery.png",
    "Courtyard 2": "courtyard2.png",
    "Panopticon": "panopticon.png",
    "Veranda": "veranda.png",
    "Balcony": "balcony.png",
    "Crowded Pub": "pub.png",
    "Pub": "pub.png",
    "Old Ballroom": "oldballroom.png",
    "Courtyard 1": "courtyard1.png",
    "Double Modern": "2xmodern.png",
    "Modern": "modern.png"
};

angular.module('spyPartyFilters', [])
    .filter('image', function() {
        return function (input) {
            return IMAGE_MAP[input];
        };
    })
    .filter('minsec', function() {
        return function(input) {
            var min = input / 60;
            var sec = input % 60;

            return sprintf("%d:%02d", min, sec);
        };
    })
    .filter('shorten', function() {
       return function(input) {
            if (input === "Beginner v. Beginner High-Rise") {
                return "BvB High-Rise";
            } else if (input === "Beginner v. Beginner Ballroom") {
                return "BvB Ballroom";
            } else {
                return input;
            }
       };
    });

var gearsApp = angular.module('gearsApp', ['ngRoute', 'spyPartyFilters', 'LocalStorageModule', 'chart.js']);

gearsApp.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('spypartygears');
});

gearsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'partials/index.html',
            controller: 'GearsController'
        })
        .when('/replay/:uuid', {
            templateUrl: 'partials/replay.html',
            controller: 'ReplayController'
        })
        .when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsController'
        })
        .when('/stats', {
            templateUrl: 'partials/stats.html',
            controller: 'StatsController'
        })
        .otherwise({
            redirectTo: '/main'
        });
}]);

gearsApp.factory('ReplayFactory', function() {
    return {
        data: {
            replays: undefined
        },
        update: function(replays) {
            this.data.replays = replays;
        }
    }
});

gearsApp.factory('UsernameFactory', function(localStorageService) {
    return {
        data: {
            username: localStorageService.get('username')
        },
        update: function(username) {
            this.data.username = username;
            localStorageService.set('username', username);
        }
    }
});

gearsApp.factory('MatchPathFactory', function(localStorageService) {
    return {
        data: {
            matchpath: localStorageService.get('matchpath')
        },
        update: function(matchpath) {
            this.data.matchpath = matchpath;
            localStorageService.set('matchpath', matchpath);
        }
    }
});

gearsApp.factory('TuneModeFactory', function(localStorageService) {
    return {
        data: {
            tuneMode: localStorageService.get('tuneMode')
        },
        update: function(tuneMode) {
            this.data.tuneMode = tuneMode;
            localStorageService.set('tuneMode', tuneMode);
        }
    }
});

gearsApp.controller('ReplayController', function($scope, $routeParams, ReplayFactory) {
    $scope.uuid = $routeParams.uuid;

    $scope.theReplay = ReplayFactory.data.replays.filter(function(it) {
        return it.uuid == $scope.uuid;
    })[0];

    $scope.missions = generateMissionObject($scope.theReplay);

    $scope.openInShell = function() {
        shell.showItemInFolder($scope.theReplay.filename);
    };
});

gearsApp.controller('SettingsController', function($scope, TuneModeFactory, UsernameFactory, MatchPathFactory) {

    $scope.username = UsernameFactory.data.username;
    $scope.matchesPath = MatchPathFactory.data.matchpath;
    $scope.tuneMode = TuneModeFactory.data.tuneMode;

    $scope.saveTuneMode = function() {
        if ($scope.tuneMode) {
            swal("Warning", "This may cause flashing colors.  Enable at your own risk.", "warning");
        }
        TuneModeFactory.update($scope.tuneMode);
    };

    $scope.saveUsername = function() {
        UsernameFactory.update($scope.username);
    };

    $scope.pickDirectory = function() {
        $scope.matchesPath = dialog.showOpenDialog({
            title: 'Choose your replay folder',
            filters: [{name: 'SpyParty Replay Files', extensions: ['replay']}],
            properties: ['openDirectory'],
            defaultPath: '%LOCALAPPDATA%\\SpyParty\\replays\\Matches'
        })[0];

        MatchPathFactory.update($scope.matchesPath);
    };
});

gearsApp.controller('StatsController', function($scope, ReplayFactory, UsernameFactory, TuneModeFactory) {
    $scope.$on('create', function (event, chart) {
        console.log(chart);
    });

    $scope.$on('update', function (event, chart) {
        console.log(chart);
    });

    $scope.username = UsernameFactory.data.username;

    $scope.replays = ReplayFactory.data.replays;

    $scope.stats = getStats($scope.replays, $scope.username);
    $scope.statData = new Stats($scope.username, $scope.replays);

    $scope.mapData = $scope.statData.getMapChartData();
    $scope.opponentData = $scope.statData.getOpponentChartData();

    $scope.sayHi = function() {
        console.log('hi');
        var mapData = {
            labels: $scope.mapData.labels,
            datasets: [
                {
                    label: 'Spy Win %',
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: $scope.mapData.data[0]
                },
                {
                    label: 'Sniper Win %',
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: $scope.mapData.data[1]
                }
            ]
        };

        var opponentData = {
            labels: $scope.opponentData.labels,
            datasets: [
                {
                    label: 'Win %',
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: $scope.opponentData.data
                }
            ]
        };

        var mapChart = document.getElementById('mapChart').getContext("2d");
        var opponentChart = document.getElementById('opponentChart').getContext("2d");
        new Chart(mapChart).Bar(mapData);
        if (TuneModeFactory.data.tuneMode) {
            var tuneModeData = [];

            for (var i = 0; i < $scope.opponentData.data.length; ++i) {
                tuneModeData.push({
                    value: $scope.opponentData.data[i],
                    label: $scope.opponentData.labels[i],
                    color: getAwfulColor(),
                    highlight: getAwfulColor()
                });
            }

            if (Math.random() < .5) {
                tuneModeData.forEach((it) => delete it['color']);
            }

            new Chart(opponentChart).Pie(tuneModeData);
        } else {
            new Chart(opponentChart).Bar(opponentData);
        }

    };


});

gearsApp.controller('GearsController', function($scope, $timeout, UsernameFactory, filterFilter, ReplayFactory, MatchPathFactory) {
    var filterReplays = function() {
        var replaySet = filterFilter($scope.replays, {level:$scope.map, missionType:$scope.layout, result:$scope.gameresult}, true);
        replaySet = filterFilter(replaySet, {$: $scope.opponent});
        return replaySet;
    };

    $scope.username = UsernameFactory.data.username;
    $scope.path = MatchPathFactory.data.matchpath;

    $scope.version = getVersionNumber();

    $scope.weWon = function(replay) {
        return getWinner(replay) === $scope.username;
    };

    $scope.weLost = function(replay) {
        return !$scope.weWon(replay);
    };

    $scope.replayStyle = function(replay) {
        if (replay['result'] === "Incomplete") {
            return "list-group-item"
        }
        return $scope.weWon(replay) ? "list-group-item list-group-item-success" : "list-group-item list-group-item-danger";
    };

    $scope.uninitialized = function() {
        return $scope.username == undefined || $scope.path == undefined || $scope.username === "" || $scope.path === "";
    };

    startParse(MatchPathFactory.data.matchpath, $scope.username, function(res, bulk) {
        $scope.replays = res;
        ReplayFactory.update(res);
        $scope.bulkResults = bulk;
        $scope.layouts = _.uniq($scope.replays.map(function(it) { return it.missionType}));
    });

    $scope.reevalBulk = function() {
        $scope.bulkResults = bulkAnalyze(filterReplays(), $scope.username);
    };

    $scope.clearFilter = function() {
        $scope.map = undefined;
        $scope.opponent = undefined;
        $scope.layout = undefined;
        $scope.gameresult = undefined;

        $scope.reevalBulk();
    };

    $scope.export = function() {
        exportExcelData(filterReplays());
    };

});

const XLSX = require('xlsx');
const _ = require('underscore');
const remote = require('electron').remote;
const dialog = remote.require('electron').dialog;

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

var replayToArray = function(replay) {
    return [
        replay.filename,
        replay.spy,
        replay.sniper,
        replay.result,
        replay.duration,
        replay.completedMissions,
        replay.selectedMissions,
        replay.pickedMissions,
        replay.humanGameStartTime,
        replay.missionType
    ];
};

var sheetFromReplays = function(replays) {
    var sheet = {};
    var range = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};

    for (var R = 0; R != replays.length; ++R) {
        if (range.e.r < R) range.e.r = R;
        for (var C = 0; C != replays[R].length; ++C) {
            if (range.e.c < C) range.e.c = C;

            var cell = { v: replays[R][C] };
            if (cell.v == null)
                continue;

            var cellRef = XLSX.utils.encode_cell({c: C, r: R});
            if (typeof cell.v === 'number')
                cell.t = 'n';
            else if (typeof cell.v === 'boolean')
                cell.t = 'b';
            else
                cell.t = 's';

            sheet[cellRef] = cell;
        }
    }

    sheet['!ref'] = XLSX.utils.encode_range(range);

    return sheet;
};

export var exportExcelData = function(replays) {
    console.log('writing');
    var replayArray = _.map(replays, replayToArray);

    var wb = new Workbook();
    wb.SheetNames.push('Replays');
    wb.Sheets['Replays'] = sheetFromReplays(replayArray);

    var file = dialog.showSaveDialog({
        title: 'Save replay data',
        filters: [{name: 'Excel Files', extensions: ['xlsx']}]
    });
    if (file != undefined) {
        XLSX.writeFile(wb, file);
        console.log('written');
    }

};

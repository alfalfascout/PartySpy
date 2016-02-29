import { JournalParser } from './parser'
import { Journal } from './journal'

const lzma = require('lzma');
const fs = require('fs');


export var testDecompress = function(file, callback) {
    var data = fs.readFileSync(file);
    lzma.decompress(data, parseResult(callback));
};

var parseResult = function(callback) {
    return function(data) {
        if (data == null)
            return;
        var parser = new JournalParser(data);
        var dataTree = parser.parsed;
        console.log("done");
        callback(new Journal(dataTree, data));
    };
};

var regedit = require('regedit');


regedit.list('HKLM\\SOFTWARE\\Adobe\\After Effects', function(err, result) {
    Object.keys(result).forEach(function (key) {
        var v = result[key].keys;
        v.forEach(function (ver) {

        });
    });
});











1
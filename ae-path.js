var regedit = require('regedit');

module.exports = function (requestedVersion) {
    return new Promise(function (resolve) {
        regedit.list('HKLM\\SOFTWARE\\Adobe\\After Effects', function (err, result) {
            if (err)
                throw err;

            Object.keys(result).forEach(function (key) {
                var v = result[key].keys;
                v.forEach(function (ver) {
                    if (requestedVersion) {
                        if (ver !== requestedVersion)
                            return;
                    }

                    regedit.list('HKLM\\SOFTWARE\\Adobe\\After Effects\\' + ver, function (err, result) {
                        var res = [];

                        Object.keys(result).forEach(function (key) {
                            var v = result[key].values;

                            Object.keys(v).filter(function (k) {
                                return k === 'InstallPath';
                            }).forEach(function (key) {
                                res.push(v[key].value);
                            });
                        });

                        resolve(res);
                    });
                });
            });
        });
    });
};
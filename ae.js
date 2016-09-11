var aePath = require('./ae-path'),
    fs = require('fs');

aePath().then(function (res) {
    console.log(res.join());
});
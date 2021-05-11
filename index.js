var fs = require('fs');
var util = require('util');

var file = 'zombie_territories.xml'; //file to check
var newfile = 'new_zombie_territories.xml'; //new file with matches removed

fs.unlink(newfile, (err) => {
    if (err) throw err;
    console.info('successfully deleted ' + newfile);
});

var log_file = fs.createWriteStream(__dirname + '/' + newfile, {flags : 'w'});

printLine = function(d) { //
    log_file.write(util.format(d) + '\n');
};

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(file)
});

//make an virtual square for zone do you need to be free. This example will remove zombies from Solnichniy
var findX1 = 13100;  //left   X coord
var findX2 = 13700;  //rignt  X coord
var findZ1 = 5900;   //top    Z coord
var findZ2 = 6500;   //bottom Z coord


lineReader.on('line', function(line) {

    var regexPositions = /\sx="(.*?)"\sz="(.*?)"\s/gm;
    var rePositions = new RegExp(regexPositions);

    if (rePositions.test(line)) {

        //test line
        match = regexPositions.exec(line);

        var x = parseFloat(match[1]);
        var z = parseFloat(match[2]);

        if(( x >= findX1 && x <= findX2 ) && ( z >= findZ1 && z <= findZ2 )) {
            printLine('<!-- removed ' + line + ' -->' );
        } else {
            printLine(line);
        }
    } else {
        printLine(line);
    }

});

lineReader.on('close', () => console.log('Done... check ' + newfile))
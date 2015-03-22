var app = angular.module('qkwrtr', ['hmTouchEvents']);

app.service('aceSrvc', function () {
    var _ace;

    this.setAce = function (ace) {
        _ace = ace;
    }

    this.space = function() {
        _ace.insert(' ');
    };

    this.backspace = function() {
        _ace.remove("left");
    };

    this.return = function() {
        _ace.insert('\n');
    };

    this.selectAll = function() {
        _ace.selectAll();
        _ace.focus();
    };

    this.clearAll = function() {
        _ace.selectAll();
        _ace.insert('');
    };

    this.length = function () {
        return _ace.session.getValue().length;
    };

    this.insert = function (text) {
        _ace.insert(text);
    };
});

app.service('quadLtrSrvc', function () {
    var i, letter;
    var letterToQuadrantSequence = [
        { letter: 'y', path : '12'},
        { letter: 'b', path : '123'},
        { letter: 'p', path : '1234'},
        { letter: 'q', path : '12341'},

        { letter: 'Y', path : '123412'},
        { letter: 'B', path : '1234123'},
        { letter: 'P', path : '12341234'},
        { letter: 'Q', path : '123412341'},

        { letter: 'n', path : '23'},
        { letter: 'm', path : '234'},
        { letter: 'f', path : '2341'},
        { letter: '!', path : '23412'},

        { letter: 'N', path : '234123'},
        { letter: 'M', path : '2341234'},
        { letter: 'F', path : '23412341'},

        { letter: 'e', path : '34'},
        { letter: 'l', path : '341'},
        { letter: 'k', path : '3412'},
        { letter: '@', path : '34123'},

        { letter: 'E', path : '341234'},
        { letter: 'L', path : '3412341'},
        { letter: 'K', path : '34123412'},

        { letter: 't', path : '41'},
        { letter: 'c', path : '412'},
        { letter: 'z', path : '4123'},
        { letter: '.', path : '41234'},

        { letter: 'T', path : '412341'},
        { letter: 'C', path : '4123412'},
        { letter: 'Z', path : '41234123'},

        { letter: 's', path : '14'},
        { letter: 'd', path : '143'},
        { letter: 'g', path : '1432'},
        { letter: '\'', path : '14321'},

        { letter: 'S', path : '143214'},
        { letter: 'D', path : '1432143'},
        { letter: 'G', path : '14321432'},

        { letter: 'a', path : '21'},
        { letter: 'r', path : '214'},
        { letter: 'x', path : '2143'},
        { letter: '?', path : '21432'},

        { letter: 'A', path : '214321'},
        { letter: 'R', path : '2143214'},
        { letter: 'X', path : '21432143'},

        { letter: 'o', path : '32'},
        { letter: 'u', path : '321'},
        { letter: 'v', path : '3214'},
        { letter: 'w', path : '32143'},

        { letter: 'O', path : '321432'},
        { letter: 'U', path : '3214321'},
        { letter: 'V', path : '32143214'},
        { letter: 'W', path : '321432143'},

        { letter: 'i', path : '43'},
        { letter: 'h', path : '432'},
        { letter: 'j', path : '4321'},
        { letter: ',', path : '43214'},

        { letter: 'I', path : '432143'},
        { letter: 'H', path : '4321432'},
        { letter: 'J', path : '43214321'}
    ];

    var pathToLetter = {};
    var letterToPath = {};
    for (i = letterToQuadrantSequence.length - 1; i >= 0; i--) {
        letter = letterToQuadrantSequence[i];
        pathToLetter[letter.path] = letter.letter;
        letterToPath[letter.letter] = letter.path;
    }

    this.letterForPath = function(path) {
        var ltr = pathToLetter[path];
        return ltr || '';
    };

    this.pathForLetter = function(letter) {
        var ltr = letterToPath[path];
        return ltr || false;
    };
});

app.directive('aceEditor', function (aceSrvc) {
    return {
        link: function (scope, elem, attr) {
            var editor = ace.edit(elem[0]);
            aceSrvc.setAce(editor);
        }
    };
});

app.controller('aceCtrl', function (aceSrvc, quadLtrSrvc) {

    var md = false;
    var quadArray = [];
    var currLetter = '';
    var cq = false;
    var lq = false;

    var clearPath = function () {
        currLetter = '';
        cq = false;
        lq = false;
        quadArray = [];
    };

    this.ace = aceSrvc;
    
    this.cl = function(letter) {
        return (currLetter === letter);
    };

    this.addPath = function (quad) {
        var path, len;

        if (cq !== quad) {
            if (lq !== quad) {
                quadArray.push(quad);
                lq = cq;
            } else {
                quadArray.pop();
                len = quadArray.length;
                lq = len > 1 ? quadArray[len - 2] : false;
            }
            cq = quad;
            path = quadArray.join('');
            currLetter = quadLtrSrvc.letterForPath(path);

            // For non-capital punctuation & double looped caps
            if (currLetter === '' && quadArray.length > 8) {
                quadArray.splice(0, 4);
                path = quadArray.join('');
                currLetter = quadLtrSrvc.letterForPath(path);
            }
        }
    };

    this.consume = function () {
        if (currLetter !== '') {
            aceSrvc.insert(currLetter);
        }
        clearPath();
    };

    this.start = function () {
        md = true;
    };

    this.on = function () {
        return md;
    };

    this.stop = function () {
        if (md && quadArray.length === 0)
            aceSrvc.insert(' ');
        md = false;
        clearPath();
    };

});
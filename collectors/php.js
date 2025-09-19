const lines = require('./base/lines');
const annotations = require('./base/annotations');
const comments = require('./base/comments');

var phpCollector = {

// https://github.com/Philipp15b/php-i18n

collectFrom: function (path, contents) {
    const rxBlockComment = /\/\*.+?(\*\/|$)/gsud;
    const rxLineComment = /\/\/[^\r\n]*[\r\n]*/gsud;
    const rxEndOfComment = /\*+\//ud;
    comments.init(contents, [rxBlockComment], [rxLineComment], rxEndOfComment);

    lines.resetLineNumbers();

    const rxL1 = /\bL::()([^\s\(;)]+)/gsud;
    const rxL2 = /\bL\(\s*(?:\$[A-Za-z0-9_\->]+\s*\?\?\s*)*(['"])((?:\\.|[^\\])+?)\1\s*[\),]/gsud;
    const matches = [...contents.matchAll(rxL1), ...contents.matchAll(rxL2)];

    return matches
        .filter((match) => {
            return !comments.isInside(match.indices[2]);
        })
        .map((match) => {
            return {
                via: 'php',
                key: match[2],
                ref: path,
                line: lines.getLineNumberAt(match.indices[2][0], contents),
                annotations: annotations.getAnnotationsFor(match.indices[2][0], match.indices[2][1], contents, comments),
            };
        });
},

//
// TODO: support single & double quoted string (escaping and multi-line) https://www.php.net/manual/en/language.types.string.php
//       if double-quoted string has $ vars inside then -discard- because we simply can't know the real/actual string
//

}

module.exports = phpCollector;
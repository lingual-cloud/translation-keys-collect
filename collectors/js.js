const decode = require('./base/decode');
const lines = require('./base/lines');
const comments = require('./base/comments');
const annotations = require('./base/annotations');

var jsCollector = {

// https://blog.logrocket.com/implementing-safe-dynamic-localization-typescript-apps/
// https://kazupon.github.io/vue-i18n/

collectFrom: function (path, contents) {
    const rxBlockComment = /\/\*.+?(\*\/|$)/gsud;
    const rxLineComment = /\/\/[^\r\n]*[\r\n]*/gsud;
    const rxEndOfComment = /\*+\//ud;
    comments.init(contents, [rxBlockComment], [rxLineComment], rxEndOfComment);

    lines.resetLineNumbers();

    const rxT = /(?:[\.\$]tc?|\btrans|\btranslate)\(\s*(?:[^'"`;\)]+(?:\?\?|\|\|)\s*)*(['"`])((?:\\.|[^\\])+?)\1\s*[\),]/gsud;
    const matches = [...contents.matchAll(rxT)];

    return matches
        .filter((match) => {
            return !comments.isInside(match.indices[2]);
        })
        .map((match) => {
            return {
                via: 'js',
                key: decode.decodeEscaped(match[2]),
                ref: path,
                line: lines.getLineNumberAt(match.indices[2][0], contents),
                annotations: annotations.getAnnotationsFor(match.indices[2][0], match.indices[2][1], contents, comments),
            };
        });
},

}

module.exports = jsCollector;
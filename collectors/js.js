const decode = require('./base/decode');
const lines = require('./base/lines');
const annotations = require('./base/annotations');

var jsCollector = {

// https://blog.logrocket.com/implementing-safe-dynamic-localization-typescript-apps/
// https://kazupon.github.io/vue-i18n/

collectFrom: function (path, contents) {
    const rxBlockComment = /\/\*.+?(\*\/|$)/gsud;
    const rxLineComment = /\/\/[^\r\n]*[\r\n]*/gsud;
    const comments = [...contents.matchAll(rxBlockComment), ...contents.matchAll(rxLineComment)].map((match) => {
        return {start: match.indices[0][0], end: match.indices[0][1]};
    });

    lines.resetLineNumbers();

    const rxT = /(?:[\.\$]tc?|\btrans|\btranslate)\(\s*(?:[^'"`;\)]+(?:\?\?|\|\|)\s*)*(['"`])((?:\\.|[^\\])+?)\1\s*[\),]/gsud;
    const matches = [...contents.matchAll(rxT)];

    return matches
        .filter((match) => {
            return this.isNotInsideComments(match.indices[2], comments);
        })
        .map((match) => {
            return {
                via: 'js',
                key: decode.decodeEscaped(match[2]),
                ref: path,
                line: lines.getLineNumberAt(match.indices[2][0], contents),
                annotations: annotations.getAnnotationsFor(match.indices[2][0], match.indices[2][1], contents),
            };
        });
},

isNotInsideComments: function(match, comments) {
    for (comment in comments) {
        if (match[0] <= comment.end && match[1] >= comment.start) {
            return false;
        }
    }
    return true;
}

}

module.exports = jsCollector;
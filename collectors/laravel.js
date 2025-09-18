const lines = require('./base/lines');
const annotations = require('./base/annotations');

var laravelCollector = {

collectFrom: function (path, contents) {
    const rxBlockComment = /\/\*.+?(\*\/|$)/gsud;
    const rxBladeComment = /\{\{--.+?(--\}\}|$)/gsud; // TODO: blade-only?
    const rxLineComment = /\/\/[^\r\n]*[\r\n]*/gsud;
    const comments = [...contents.matchAll(rxBlockComment), 
        ...contents.matchAll(rxBladeComment), ...contents.matchAll(rxLineComment)].map((match) => {
        return {start: match.indices[0][0], end: match.indices[0][1]};
    });

    lines.resetLineNumbers();

    const rxLaravel = /\b(?:__|trans(?:_choice|late)?)\(\s*(?:\$[A-Za-z0-9_\->]+\s*\?\?\s*)*(?:(['"])(.*?)(?<!\\)\1\s*[\),])/gsud;
    const matches = [...contents.matchAll(rxLaravel)];

    return matches
        .filter((match) => {
            return this.isNotInsideComments(match.indices[2], comments);
        })
        .map((match) => {
            return {
                via: 'laravel',
                key: match[2],
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

module.exports = laravelCollector;
const lines = require('./base/lines');
const annotations = require('./base/annotations');
const comments = require('./base/comments');

var laravelCollector = {

collectFrom: function (path, contents) {
    const rxBlockComment = /\/\*.+?(?:\*\/|$)/gsud;
    const rxBladeComment = /\{\{--.+?(?:--\}\}|$)/gsud; // TODO: blade-only? (see also rxEndOfComment below)
    const rxLineComment = /\/\/[^\r\n]*[\r\n]*/gsud;
    const rxEndOfComment = /\*+\/|-+\}\}/ud;
    comments.init(contents, [rxBlockComment, rxBladeComment], [rxLineComment], rxEndOfComment);

    lines.resetLineNumbers();

    const rxLaravel = /\b(?:__|trans(?:_choice|late)?)\(\s*(?:\$[A-Za-z0-9_\->]+\s*\?\?\s*)*(?:(['"])(.*?)(?<!\\)\1\s*[\),])/gsud;
    const matches = [...contents.matchAll(rxLaravel)];

    return matches
        .filter((match) => {
            return !comments.isInside(match.indices[2]);
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

}

module.exports = laravelCollector;
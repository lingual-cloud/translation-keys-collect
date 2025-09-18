const lines = require('./base/lines');
const annotations = require('./base/annotations');

var htmlCollector = {

collectFrom: function (path, contents) {
    const rxLineComment = /<!--.+?-->/gsud;
    const comments = [...contents.matchAll(rxLineComment)].map((match) => {
        return {start: match.indices[0][0], end: match.indices[0][1]};
    });

    lines.resetLineNumbers();

    const rxTkey = /\b(data-i18n-key|translation-key|localization-key)\s*=\s*(['"])(.+?)\2/gsud; // TODO: support custom attribute name
    const matches = [...contents.matchAll(rxTkey)];

    return matches
        .filter((match) => {
            return this.isNotInsideComments(match.indices[3], comments);
        })
        .map((match) => {
            return {
                via: 'html',
                key: match[3],
                ref: path,
                line: lines.getLineNumberAt(match.indices[3][0], contents),
                annotations: annotations.getAnnotationsFor(match.indices[3][0], match.indices[3][1], contents),
            };
        });
},

isNotInsideComments: function(match, comments) {
    for (let i = 0; i < comments.length; i++) {
        if (match[0] <= comments[i].end && match[1] >= comments[i].start) {
            return false;
        }
    }
    return true;
}

//
// TODO: support special chars that can occur in html attributes (e.g. htmlspecialchars)
//       check if we have DOMParser
//function htmlDecode(input) {
//  var doc = new DOMParser().parseFromString(input, "text/html");
//  return doc.documentElement.textContent;
//}
//https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js
//

}

module.exports = htmlCollector;
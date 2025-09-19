const lines = require('./base/lines');
const comments = require('./base/comments');
const annotations = require('./base/annotations');

var htmlCollector = {

collectFrom: function (path, contents) {
    const rxBlockComment = /<!--.+?-->/gsud;
    const rxEndOfComment = /-+>/ud;
    comments.init(contents, [rxBlockComment], [], rxEndOfComment);

    lines.resetLineNumbers();

    const rxTkey = /\b(data-i18n-key|translation-key|localization-key)\s*=\s*(['"])(.+?)\2/gsud; // TODO: support custom attribute name
    const matches = [...contents.matchAll(rxTkey)];

    return matches
        .filter((match) => {
            return !comments.isInside(match.indices[3]);
        })
        .map((match) => {
            return {
                via: 'html',
                key: match[3],
                ref: path,
                line: lines.getLineNumberAt(match.indices[3][0], contents),
                annotations: annotations.getAnnotationsFor(match.indices[3][0], match.indices[3][1], contents, comments),
            };
        });
},

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
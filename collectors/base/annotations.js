const lines = require('./lines');

var annotations = {

getAnnotationsFor: function(startIndex, endIndex, content, comments) {
    const priorLine = lines.getPriorLine(startIndex, content);
    const restOfLine = lines.getRestOfLine(endIndex, content);

    const rxLingual = new RegExp('/@lingual(.+?)(?:'+comments.getEndOfCommentRegex(false)+')/iumd');
    
    const match = priorLine.match(rxLingual);
    const match2 = restOfLine.match(rxLingual);

    let annotations = {};

    if (match && comments.isInside(match.indices[1])) annotations = this.parseAnnotation(match[1], annotations);
    if (match2 && comments.isInside(match2.indices[1])) annotations = this.parseAnnotation(match2[1], annotations);

    return annotations;
},

parseAnnotation: function(spec, annobj) {
    const rxInitTranslation = /\b([a-z]{2}-[A-Z]{2}):(.+)/iu;
    let match = spec.match(rxInitTranslation);
    if (match) {
        annobj.initTranslation = { locale: match[1], text: match[2] };
    }

    const rxLocale = /\b\[([a-z]{2}-[A-Z]{2}|id)\]\b/iu;
    match = spec.match(rxLocale);
    if (match) {
        annobj.locale = match[1] === 'id' ? '-id-' : match[1];
    }

    return annobj;
},

}

module.exports = annotations;
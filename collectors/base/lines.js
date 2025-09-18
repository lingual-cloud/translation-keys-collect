var lines = {

lastLineNr: 1,
lastLineNrIndex: 0,

resetLineNumbers: function() {
    this.lastLineNr = 1;
    this.lastLineNrIndex = 0;
},

getLineNumberAt: function(index, content) {
    let lineNr = this.lastLineNr;
    for (let c = this.lastLineNrIndex; c < index; c++) {
        if (content[c] === '\r' || content[c] === '\n') {
            lineNr++;
            if (content[c] === '\r' && c+1 < index && content[c+1] === '\n') c++;
        }
    }
    this.lastLineNrIndex = c;
    this.lastLineNr = lineNr;
    return lineNr;
},

getPriorLine: function(fromIndex, content) {
    let priorLine = '';
    for (let c = fromIndex - 1; c >= 0; c--) {
        if (content[c] === '\r' || content[c] === '\n') {
            if (content[c] === '\n' && c-1 >= 0 && content[c-1] === '\r') c--;
            for ( ; c >= 0; c--) {
                if (content[c] === '\r' || content[c] === '\n') {
                    c = 0;
                    break;
                }
                priorLine = content[c] + priorLine;
            }
        }
    }
    return priorLine;
},

getRestOfLine: function(fromIndex, content) {
    let restOfLine = '';
    for (let c = fromIndex + 1; c < content.length; c++) {
        if (content[c] === '\r' || content[c] === '\n') {
            break;
        }
        restOfLine += content[c];
    }
    return restOfLine;
},

}

module.exports = lines;
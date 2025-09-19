var comments = {

blockComments: [],
lineComments: [],

init: function(content, rxsBlock, rxsLine) {
    this.blockComments = [];
    this.lineComments = [];
    for (r = 0; r < rxsBlock.length; r++) {
        this.blockComments = [...this.blockComments, ...[...content.matchAll(rxsBlock[r])].map((match) => {
            return {start: match.indices[0][0], end: match.indices[0][1]};
        })];
    }
    for (r = 0; r < rxsLine.length; r++) {
        this.lineComments = [...this.lineComments, ...[...content.matchAll(rxsLine[r])].map((match) => {
            return {start: match.indices[0][0], end: match.indices[0][1]};
        })];
    }
},

isInside: function(match) {
    for (let i = 0; i < this.blockComments.length; i++) {
        if (match[0] <= this.blockComments[i].end && match[1] >= this.blockComments[i].start) {
            return true;
        }
    }
    for (let i = 0; i < this.lineComments.length; i++) {
        if ((match[0] >= this.lineComments[i].start && match[0] <= this.lineComments[i].end)
            || (match[1] >= this.lineComments[i].start && match[1] <= this.lineComments[i].end)) {
            return true;
        }
    }
    return false;
}

}

module.exports = comments;
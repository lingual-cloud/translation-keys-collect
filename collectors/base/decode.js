var decode = {

decodeEscaped: function(source) {
    const rxEscaped = /(?:(\\(u([0-9a-f]{4})|u\{([0-9a-f]+)\}|x([0-9a-f]{2})|(\d{1,3})|([\s\S]|$)))|([\s\S]))/giu;

    let result = '';

    while (null != (match = rxEscaped.exec(source))) {
        const [, sequence, fallback, unicode, unicodePoint, hex, octal, char, literal] = match;

        if (literal) {
            result += literal;
            continue;
        }

        let code = null;

        if (char != null) {
            code = null;
        } else if (octal) {
            code = Number.parseInt(octal, 8);
        } else {
            code = Number.parseInt("" + (unicodePoint || unicode || hex), 16);
        }

        try {
            result += getUnescaped(sequence, code) || fallback;
        } catch (e) {
            result += fallback;
        }
    }

    return result;
},

getUnescaped: function(sequence, code) {
    if (code != null) {
        return String.fromCodePoint(code);
    }

    switch (sequence) {
        case '\\b':
            return '\b';
        case '\\f':
            return '\f';
        case '\\n':
            return '\n';
        case '\\r':
            return '\r';
        case '\\t':
            return '\t';
        case '\\v':
            return '\v';
    }

    return false;
}

}

module.exports = decode;
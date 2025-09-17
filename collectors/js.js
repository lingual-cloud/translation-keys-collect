var jsCollector = {

// https://blog.logrocket.com/implementing-safe-dynamic-localization-typescript-apps/
// https://kazupon.github.io/vue-i18n/

collectFrom: function (path, contents) {
    contents = contents.replaceAll(/\/\*.+?(\*\/|$)/gsu, '');
    contents = contents.replaceAll(/\/\/[^\r\n]*[\r\n]*/gsu, '');

    const rxT = /(?:[\.\$]tc?|\btrans|\btranslate)\(\s*(?:[^'"`;\)]+(?:\?\?|\|\|)\s*)*(['"`])((?:\\.|[^\\])+?)\1\s*[\),]/gsu;
    const matches = [...contents.matchAll(rxT)];

    return matches.map((match) => {
        return {
            via: 'js',
            key: this.removeSlashes(match[2]),
            ref: path
        };
    }, matches);
},

removeSlashes: function (source) {
    const rx = /(?:(\\(u([0-9a-f]{4})|u\{([0-9a-f]+)\}|x([0-9a-f]{2})|(\d{1,3})|([\s\S]|$)))|([\s\S]))/giu;

    let match = null;
    let result = '';

    while (null != (match = rx.exec(source))) {
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
            const unescaped = getUnescaped(sequence, code);

            if (!unescaped) {
                result += fallback;
            } else if (unescaped === true) {
                result += getUnescapedAny(sequence, code) || fallback;
            } else {
                result += unescaped;
            }
        } catch (_error) {
            result += fallback;
        }
    }
},

getUnescapedAny: function(sequence, code) {
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
        // Not necessary because "\\0" is interpreted as an octal escape, so the
        // `code` argument is set.
        // case '\\0':
        //   return '\0';
    }

    return false;
}

}

module.exports = jsCollector;
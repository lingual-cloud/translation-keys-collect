var phpCollector = {

// https://github.com/Philipp15b/php-i18n

collectFrom: function (path, contents) {
    contents = contents.replaceAll(/\/\*.+?(\*\/|$)/gsu, '');
    contents = contents.replaceAll(/\/\/[^\r\n]*[\r\n]*/gsu, '');

    const rxL1 = /\bL::()([^\s\(;)]+)/gsu;
    const rxL2 = /\bL\(\s*(?:\$[A-Za-z0-9_\->]+\s*\?\?\s*)*(['"])((?:\\.|[^\\])+?)\1\s*[\),]/gsu;
    const matches = [...contents.matchAll(rxL1), ...contents.matchAll(rxL2)];

    return matches.map((match) => {
        return {
            via: 'php',
            key: match[2],
            ref: path
        };
    }, matches);
}

}

module.exports = phpCollector;
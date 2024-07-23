var jsCollector = {

// https://blog.logrocket.com/implementing-safe-dynamic-localization-typescript-apps/

collectFrom: function (path, contents) {
    contents = contents.replaceAll(/\/\*.+?(\*\/|$)/gsu, '');
    contents = contents.replaceAll(/\/\/[^\r\n]*[\r\n]*/gsu, '');

    const rxT = /\.t\(\s*(?:[^'"`;\)]+(?:\?\?|\|\|)\s*)*(['"`])((?:\\.|[^\\])+?)\1\s*[\),]/gsu;
    const matches = [...contents.matchAll(rxT)];

    return matches.map((match) => {
        return {
            via: 'js',
            key: match[2],
            ref: path
        };
    }, matches);
}

}

module.exports = jsCollector;
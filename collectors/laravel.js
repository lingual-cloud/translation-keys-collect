var laravelCollector = {

collectFrom: function (path, contents) {
    contents = contents.replaceAll(/\/\*.+?(\*\/|$)/gsu, '');
    contents = contents.replaceAll(/\{\{--.+?(--\}\}|$)/gsu, ''); // TODO: blade-only?
    contents = contents.replaceAll(/\/\/[^\r\n]*[\r\n]*/gsu, '');

    const rxLaravel = /\b(?:__|trans(?:_choice|late)?)\(\s*(?:\$[A-Za-z0-9_\->]+\s*\?\?\s*)*(?:(['"])(.*?)(?<!\\)\1\s*[\),])/gsu;
    const matches = [...contents.matchAll(rxLaravel)];

    return matches.map((match) => {
        return {
            via: 'laravel',
            key: match[2],
            ref: path
        };
    }, matches);
}

}

module.exports = laravelCollector;
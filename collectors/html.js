var htmlCollector = {

collectFrom: function (path, contents) {
    contents = contents.replaceAll(/<!--.+?-->/gsu, '');

    const rxTkey = /\b(data-i18n-key|translation-key|localization-key)\s*=\s*(['"])(.+?)\2/gsu; // TODO: support custom attribute name
    const matches = [...contents.matchAll(rxTkey)];

    return matches.map((match) => {
        return {
            via: 'html',
            key: match[3],
            ref: path
        };
    }, matches);
}

}

module.exports = htmlCollector;
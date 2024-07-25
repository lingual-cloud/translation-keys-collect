const fsPromises = require('fs/promises');
const path = require('path');
const jsCollector = require('./collectors/js');
const htmlCollector = require('./collectors/html');
const phpCollector = require('./collectors/php');
const laravelCollector = require('./collectors/laravel');

module.exports = async (core, httpx) => {

const collectors = {
    js: jsCollector,
    html: htmlCollector,
    php: phpCollector,
    laravel: laravelCollector,
}

try {
    const sourceId = 'f83h40hg3589/my-test-source-id'; // core.getInput('source-id', {required: true});

    const basePath = process.cwd();

    let all = [];
    let nrFiles = 0;

    const dirlist = await fsPromises.opendir('.', {recursive: true});
    for await (const dirent of dirlist) {
        if (!dirent.isDirectory() && dirent.isFile() && ++nrFiles) {
            const collected = await processFile(dirent, basePath);
            if (collected && collected.length) all = all.concat(collected);
        }
    }

    console.log(all);

    if (all.length) {
        console.log('Submitting '+all.length+' translation keys..');
        submitCollected(all, sourceId);
    }
    else {
        console.log('Found no translatio keys in '+nrFiles+' files');
    }
}
catch (error) {
    core.setFailed(error.message);
}

function processFile(dirent, basePath) {
    const dotIdx = dirent.name.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const ext = dirent.name.substr(dotIdx).toLowerCase();
    if (ext === '.ts' || ext === '.js' || ext === '.vue') {
        return processSourceFile(dirent, [collectors.js], basePath);
    }
    else if (ext === '.php') {
        return processSourceFile(dirent, [collectors.php, collectors.laravel], basePath)
    }
    else if (ext === '.html') {
        return processSourceFile(dirent, [collectors.html], basePath)
    }

    return null;
}

async function processSourceFile(dirent, collectors, basePath) {
    const filePath = path.resolve(dirent.path, dirent.name);
    const refPath = referencePath(filePath, basePath);
    const contents = await fsPromises.readFile(filePath, { encoding: 'utf8' }); // TODO: encoding could not be utf8
    let all = [];
    for (const collector of collectors) {
        const collected = collector.collectFrom(refPath, contents);
        if (collected && collected.length) all = all.concat(collected);
    }
    return all;
}

function referencePath(filePath, basePath) {
    let refPath = filePath.indexOf(basePath) === 0 ? filePath.replace(basePath, '') : filePath;
    if (refPath.indexOf(path.sep) === 0) {
        refPath = refPath.replace(path.sep, '');
    }
    return refPath;
}

function submitCollected(all, sourceId) {
    let allByKey = {};
    for (const collected of all) {
        if (!allByKey[collected.key]) {
            allByKey[collected.key] = {
                origin: {type: 'source'},
                text: collected.key,
                refs: [{filePath: collected.ref, via: collected.via}],
            };
        }
        else {
            allByKey[collected.key].refs.push({filePath: collected.ref, via: collected.via});
        }
        if (collected.locale) {
            allByKey[collected.key].locale = collected.locale;
        }
    }

    const postData = JSON.stringify({
        source: {id: sourceId},
        texts: Object.values(allByKey),
    });

    const http = new httpx.HttpClient('lingual-cloud/translation-keys-collect');
    http.post('https://voca.lingual.cloud/texts', postData).then((res) => {
        if (res.message.statusCode === httpx.HttpCodes.OK) {
            console.log('Submitted successfully');
        }
        else {
            core.setFailed('Submit failed: '+res.message.statusCode);
        }
    }).catch((err) => {
        core.setFailed('Submit error: '+err);
    });
}

}
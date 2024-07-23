const fsPromises = require('fs/promises');
const path = require('path');
const jsCollector = require('./collectors/js');
const htmlCollector = require('./collectors/html');
const phpCollector = require('./collectors/php');
const laravelCollector = require('./collectors/laravel');

module.exports = async (core, github) => {

const collectors = {
    js: jsCollector,
    html: htmlCollector,
    php: phpCollector,
    laravel: laravelCollector,
}

try {
    let all = [];

    const basePath = process.cwd();

    const dirlist = await fsPromises.opendir('.', {recursive: true});
    for await (const dirent of dirlist) {
        if (!dirent.isDirectory() && dirent.isFile()) {
            const collected = await processFile(dirent, basePath);
            if (collected && collected.length) all = all.concat(collected);
        }
    }

    console.log(all);

    console.log('Submitting '+all.length+' translation keys..');
}
catch (error) {
    core.setFailed(error.message);
}

function processFile(dirent, basePath) {
    const dotIdx = dirent.name.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const ext = dirent.name.substr(dotIdx).toLowerCase();
    if (ext === '.ts') {
        return processSourceFile(dirent, [collectors.js], basePath);
    }
    else if (ext === '.js') {
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

}
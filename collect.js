const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')
          
try {
    fs.glob('**/*.php', (err, matches) => {
        if (err) throw err;
        console.log(matches);
    });

    console.log('Finished');
}
catch (error) {
    core.setFailed(error.message);
}
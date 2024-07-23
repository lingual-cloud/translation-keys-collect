const core = require('@actions/core');
const github = require('@actions/github');
const collect = require('./collect');

collect(core, github);
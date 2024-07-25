const core = require('@actions/core');
const httpx = require('@actions/http-client');
const collect = require('./collect');

collect(core, httpx);
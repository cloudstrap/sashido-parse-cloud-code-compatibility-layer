const { cloudCodeTriggerMethods } = require('../constants');

const store = {};
const run = (m, name) => {
    return store[m][name]({}, {});
};
const tests = (global.tests = {
    methods: cloudCodeTriggerMethods,
    run,
    store
});

const Parse = (global.Parse = {
    Cloud: {}
});

tests.methods.forEach(m => {
    store[m] = {};
    const methodStore = store[m];
    Parse.Cloud[m] = (name, fn) => {
        methodStore[name] = fn;
    };
});

require('../');

const { tests, Parse } = global;
const assert = require('assert');

describe('new style sync', () => {
    tests.methods.forEach(m => {
        it(`test ${m} return undefined`, async () => {
            Parse.Cloud[m]('test', req => {
                return undefined;
            });

            const res = await tests.run(m, 'test');
            assert.equal(res, undefined);
        });

        it(`test ${m} return 1`, async () => {
            Parse.Cloud[m]('test', req => {
                return 1;
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} nothing returned`, async () => {
            Parse.Cloud[m]('test', req => {});

            const val = await tests.run(m, 'test');
            assert.equal(val, undefined);
        });

        it(`test ${m} throw 'err'`, async () => {
            Parse.Cloud[m]('test', req => {
                throw 'err';
            });

            try {
                await tests.run(m, 'test');
            } catch (e) {
                assert.equal(e, 'err');
                return;
            }

            assert.fail('res.error() should throw');
        });
    });
});

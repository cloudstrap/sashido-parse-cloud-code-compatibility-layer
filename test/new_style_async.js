const { tests, Parse } = global;
const assert = require('assert');

describe('new style async', () => {
    tests.methods.forEach(m => {
        it(`test ${m} return undefined`, async () => {
            Parse.Cloud[m]('test', async req => {
                return undefined;
            });

            const res = await tests.run(m, 'test');
            assert.equal(res, undefined);
        });

        it(`test ${m} return 1`, async () => {
            Parse.Cloud[m]('test', async req => {
                return 1;
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} return 1 with timeout`, async () => {
            Parse.Cloud[m]('test', async req => {
                return await new Promise(resolve =>
                    setTimeout(() => resolve(1), 1)
                );
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} nothing returned`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {});

            const val = await tests.run(m, 'test');
            assert.equal(val, undefined);
        });

        it(`test ${m} throw 'err'`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
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

        it(`test ${m} reject 'err' with timeout`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
                await new Promise((_, reject) =>
                    setTimeout(() => reject('err'), 1)
                );
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

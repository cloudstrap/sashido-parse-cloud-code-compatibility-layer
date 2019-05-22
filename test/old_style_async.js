const { tests, Parse } = global;
const assert = require('assert');

describe('old style async', () => {
    tests.methods.forEach(m => {
        it(`test ${m} res.success()`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
                res.success();
            });

            await tests.run(m, 'test');
        });

        it(`test ${m} res.success(1)`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
                res.success(1);
                return 5;
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} res.success(1) with timeout`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
                await new Promise(resolve =>
                    setTimeout(() => res.success(1) && resolve(5), 1)
                );
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} res.success() not called, empty promise returned`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {});

            const val = await tests.run(m, 'test');
            assert.equal(val, undefined);
        });

        it(`test ${m} res.error('err')`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
                res.error('err');
            });

            try {
                await tests.run(m, 'test');
            } catch (e) {
                assert.equal(e, 'err');
                return;
            }

            assert.fail('res.error() should throw');
        });

        it(`test ${m} res.error() with timeout`, async () => {
            Parse.Cloud[m]('test', async (req, res) => {
                await new Promise((_, reject) =>
                    setTimeout(() => res.error('err') && reject('err1'), 1)
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

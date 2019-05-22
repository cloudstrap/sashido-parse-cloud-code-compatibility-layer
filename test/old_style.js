const { tests, Parse } = global;
const assert = require('assert');

describe('old style', () => {
    tests.methods.forEach(m => {
        it(`test ${m} res.success()`, async () => {
            Parse.Cloud[m]('test', (req, res) => {
                res.success();
            });

            await tests.run(m, 'test');
        });

        it(`test ${m} res.success(1)`, async () => {
            Parse.Cloud[m]('test', (req, res) => {
                res.success(1);
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} res.success(1) with timeout`, async () => {
            Parse.Cloud[m]('test', (req, res) => {
                setTimeout(() => res.success(1), 1);
            });

            const val = await tests.run(m, 'test');
            assert.equal(val, 1);
        });

        it(`test ${m} res.success() not called`, done => {
            Parse.Cloud[m]('test', (req, res) => {});

            let called = false;
            setTimeout(() => {
                if (called) {
                    assert.fail('res.success() should not be called');
                } else {
                    done();
                }
            }, 10);
            tests.run(m, 'test').then(() => (called = true));
        });

        it(`test ${m} res.error('err')`, async () => {
            Parse.Cloud[m]('test', (req, res) => {
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
            Parse.Cloud[m]('test', (req, res) => {
                setTimeout(() => res.error('err'), 1);
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

const { cloudCodeTriggerMethods } = require('./constants');

module.exports = function(sdk) {
    cloudCodeTriggerMethods.forEach(m => {
        const orig = sdk.Cloud[m];
        sdk.Cloud[m] = (name, callback) => {
            const fn = req => {
                return new Promise(async (resolve, reject) => {
                    let resolveCalled = false;
                    const resolveChecked = (...args) => {
                        if (!resolveCalled) {
                            resolveCalled = true;
                            resolve.call(null, ...args);
                        }
                    };

                    let rejectCalled = false;
                    const rejectChecked = (...args) => {
                        if (!rejectCalled) {
                            rejectCalled = true;
                            reject.call(null, ...args);
                        }
                    };

                    const response = {
                        success: resolveChecked,
                        error: rejectChecked
                    };

                    try {
                        if (!callback) {
                            return resolveChecked();
                        }

                        if (callback.length <= 1) {
                            //the new style functions - they don't accept a second argument
                            return resolveChecked(await callback(req));
                        } else {
                            const result = callback(req, response);
                            if (result && typeof result.then === 'function') {
                                //the function is most likely async
                                return resolveChecked(await result);
                            } else if (result) {
                                //the function is most likely sync and returns a result
                                return resolveChecked(result);
                            }
                            //else the function most likely will call
                            //res.success/error at some point
                        }
                    } catch (e) {
                        rejectChecked(e);
                    }
                });
            };

            return orig(name, fn);
        };
    });
};

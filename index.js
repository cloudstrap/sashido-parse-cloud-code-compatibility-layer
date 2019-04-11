const cloudCodeTriggerMethods = [
    'beforeSave',
    'afterSave',
    'beforeDelete',
    'afterDelete',
    'beforeFind',
    'afterFind',
    'define'
];

cloudCodeTriggerMethods.forEach(m => {
    const orig = Parse.Cloud[m];
    Parse.Cloud[m] = (name, callback) => {
        const fn = req => {
            return new Promise((resolve, reject) => {
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
                    const result = callback(req, response);
                    if (result && typeof result.then === 'function') {
                        result.then(resolveChecked).catch(rejectChecked);
                    }
                } catch (e) {
                    rejectChecked(e);
                }
            });
        };

        return orig(name, fn);
    };
});

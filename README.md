# SashiDo Parse Cloud Code compatibility layer

Allows using old style Cloud Code with version >=3.0.0 of Parse Server. For more details visit: [Parse Community 3.0.0](https://github.com/parse-community/parse-server/blob/master/3.0.0.md)

## Installation

```bash
$ npm install https://github.com/cloudstrap/sashido-parse-cloud-code-compatibility-layer
```

## Usage

Just require the module on the top of your `main.js` file:

```js
require('sashido-parse-cloud-code-compatibility-layer');
```

## Gotchas

There's only one corner case not handled by the compatibility layer: When a Cloud Function is synchronous, returns `undefined` and has two arguments. In general this should not be a problem but there might be a scenario where your cloud function would do some processing and never return a value. In Parse 2.x you would have two arguments in your function `(req, res)`. In Parse 3.x the `res` argument is obsolete, so if your function is migrated to Parse 3.x it should not have this argument. If it does the compatibility layer cannot be sure whether you would want to call `res.success` at some point or not. In summary:

Do:

```javascript
Parse.Cloud.define('test_fn', (req) {
    //do something
    //return nothing
})
```

Don't:

```javascript
Parse.Cloud.define('test_fn', (req, res) {
    //do something
    //return nothing

    //this function will hang since the compatibility layer wouldn't know if
    //you want to call res.success
})
```

Everything else should be supported. Refer to the tests for more details.

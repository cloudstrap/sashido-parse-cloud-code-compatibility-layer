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

There's one corner case that the compatibility layer cannot handle at the moment - synchronous functions. In Parse 2.x one would call `response.success` to tell the Parse Server that this trigger is done. The return type of the user-supplied function would be ignored. In Parse 3.x there's no `response.success`, instead the return value is used. If ther value is a `Promise`, then the Parse Server would `await` that promise, if the value is not a `Promise` it would be wrapped in one. The resolve value would be used as a response.

Let's now think about what the compatiblity layer has to be able to do:

-   Handle the case where the function would return no value, but will later in a callback call `response.success` - as per Parse 2.x
-   Handle the case where the function would return a `Promise` but will later in a callback call `response.success` - still valid as per Parse 2.x
-   Handle the case where the function would return a `Promise` and will never call `response.success` - as per Parse 3.x
-   Handle the case where the function would return synchronously by returning no value and never calling `response.success`

The last case is the case which the compatibility layer cannot handle because there's no way of knowing whether the use will return a `Promise` or call `response.success`, so when it returns synchronously it just waits for `response.success`.

Here are some working and the non-working scenarios in code:

Working:

```js
//we are calling res.success at some point
Parse.Cloud.define('working_1', (req, res) => {
    Promise.resolve().then(() => res.success(5));
});

//async actually converts the function to return a Promise
Parse.Cloud.define('working_2', async (req, res) => {
    return 5;
});

//same as above without async
Parse.Cloud.define('working_3', (req, res) => {
    return Promise.resolve(5);
});
```

Non-working:

```js
//the function is synchronous, neither a promise is returned, nor res.success is called
Parse.Cloud.define('non_working', req => {
    return 5;
});
```

Our suggestion is to make sure all functions are `async` or call `response.success` until the migration to Parse 3.x is complete. After that the compatiblity layer can be disabled (not yet available) and this difference will not be present.

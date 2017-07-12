This demo directory shows why I'm [requesting](https://github.com/karma-runner/karma/issues/2756)
the `appendsha` option.

To run tests, `cd` to this directory and then run

`npm test`

That will install all dependencies and run the tests.
They should pass, since [`appendsha: false` is being used](https://github.com/Comcast/karma-polymer/blob/fb0307d34bd0bd1558306fec94085342738d4174/lib/init.js#L36).

If you update the `"karma"` reference in `package.json` to point to `#1.7.0`,
(which does not support the `appendsha` option)
remove the `karma` folder from your `node_modules` directory and re-rerun
`npm test`, you'll see the tests will fail with this error:

```
  Uncaught SyntaxError: Identifier 'KarmaDependency' has already been declared
  at src/elements/karma-dependency/karma-dependency.js:1
```

If you open the Network tab in Chrome and run the tests, you'll see the reason is that
karma-dependency.html (and therefore karma-dependency.js) is loaded twice.
The logic the browser follows to load them twice is as follows:

1. http://localhost:9876/base/src/elements/karma-dependency/karma-dependency.html?48890ce19929642f57e89d4466048bfbee921de6 is loaded via the
`'src/elements/**/!(demo|test)/*.html'` path defined in `client.polymer.src` in `karma.conf.js`.
`karma-polymer` is set up to [include & serve that file](https://github.com/Comcast/karma-polymer/blob/fb0307d34bd0bd1558306fec94085342738d4174/lib/init.js#L36).

2. `karma-dependency.html` includes `<script src="karma-dependency.js"></script>` to load its
JavaScript. The JS code could be included directly in the file instead of being linked to,
but we separate it out for code-coverage purposes.
We [never load that JS with the query string since it is only served, not included](https://github.com/Comcast/karma-polymer/blob/fb0307d34bd0bd1558306fec94085342738d4174/lib/init.js#L43).
(Note: The double-load result is the same even if we include that JS directly in `karma-dependency.html`
via a `<script></script>` tag with code in it.)

3. http://localhost:9876/base/src/elements/karma-demo/karma-demo.html?61b5304457e0384a00700c41c60a50c065d5a7c7
is also loaded via the
`'src/elements/**/!(demo|test)/*.html'` path defined in `client.polymer.src` in `karma.conf.js`.
That file includes an HTML Import of `karma-dependency.html`. Since that page is just a static HTML page,
it has no way of appending the SHA query string. Chrome makes a request for http://localhost:9876/base/src/elements/karma-dependency/karma-dependency.html, which results in
`karma-dependency.html` being loaded a second time since the request without a query string is seen as a
different resource. Chrome then loads `karma-dependency.js` again for that file due to `<script src="karma-dependency.js"></script>`


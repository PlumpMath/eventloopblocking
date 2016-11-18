# eventLoopDemo

This is simple demo to show the event loop blockage of sync vs async fs methods.

The "testData.html" is just here to exercise fs.readFile and fs.readFileSync. It also happens to be the html for node fs docs :)

To use this, simply npm i -S (to get fs-promise) and then run "node index.js"
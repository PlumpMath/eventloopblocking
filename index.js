'use strict';

const fs = require('fs-promise');
const path = './testData.html';

function getBar(width, type) {
  let space = '';
  let count = 23 - width;
  for(let i = 0; i < (23-width); i++) {
    space += ' ';
  }

  space += '|';
  return space;
}

function printRow(){
  console.log('-------------------------------------');
}

function printStuff(type, startOrEnd, i) {
  const bar = (i === 10 && type === 'sync ' && startOrEnd === 'start') ? '         Im blocked here bro...' : getBar((i + '').length);
  console.log(`${type} ${startOrEnd}:`, i, bar);

}

let asyncCounter = 0;

function asyncRead(i) {
  printStuff('async', 'start', i);

  fs.readFile(path)
    .then((data) =>{

      if (asyncCounter === 0) {
        printRow();
        console.log('The Async calls have started to callback. The eventloop was not blocked while the files were being read.');
        printRow();
      }

      printStuff('async', 'end  ', i);
      asyncCounter++;
      if(asyncCounter === 20) {
        printRow();
        console.log('IMPORTANT!! One more important thing to note: This demo is using fs-promise to promisify some of the fs methods.');
        console.log('You might be thinking: "Hey! Why didnt fs-promise promisify the readFileSync???"');
        console.log('Fs-promise only wraps ASYNC fs methods. It does not turn a sync function in an async.');
        console.log('');
        console.log('Blocking the event loop is bad. Blocking the event loop inside another loop is EXTRA bad.');
        console.log('If your function needs to wait for the result of an fs operation, use a callback or promisify it and');
        console.log('use the results in a "then" block. This way your execution is blocked, but everyone elses execution is not.')
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function syncRead(i) {
  printStuff('sync ', 'start', i);
  fs.readFileSync(path);
  printStuff('sync ', 'end  ', i);
}

printRow();
console.log('TL:DR => Dont use fs.anythingSYNC unless you have a really good reason to, like the operation occurs');
console.log('during the bootstrapping of the app and other modules depend on the results');
printRow();
console.log('Async example, the async reads are started, and the "END" console log fires before the calls have returned ');
console.log('In fact, the callbacks wont be executed until the sync example is finished');

printRow();
console.log('ASYNC LOOP START');
printRow();
for(let i = 0; i < 20; i++) {
  asyncRead(i);
}

printRow();
console.log('ASYNC LOOP END');
printRow();

console.log('In this sync example, notice how the whole event loop is blocked here, waiting for each readSync to finish before executing');
printRow();
console.log('SYNC LOOP START');
printRow();
for(let i = 0; i < 20; i++) {
  syncRead(i);
}
printRow();
console.log('SYNC LOOP END');
console.log('You can see here that the sync reads are fully blocking the event loop.');
console.log('This may not seem like a big deal, but we need to remember that node is single threaded.');
console.log('This means that all users of the app share a signle thread. So if the event loop is blocked');
console.log('by a Sync operation, every user is going to feel it. Imagine 50 users, all calling an eventloop blocking loop.');
console.log('Its not just our own execution we need to think about. Every execution shares the same thread.');












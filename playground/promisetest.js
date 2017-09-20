const doWorkOne = () => {
  return new Promise((resolve, reject) => {
    resolve('Here is some data from one');
  });
};

const doWorkTwo = () => {
  return new Promise((resolve, reject) => {
    resolve('Here is some data from two');
  });
};

doWorkOne().then((responseOne) => {
  console.log(responseOne);
  // The return here lets us continue the promise chain. The next then call will fire once doWorkTwo resolve
  return doWorkTwo();
}).then((responseTwo) => {
  console.log(responseTwo);
});

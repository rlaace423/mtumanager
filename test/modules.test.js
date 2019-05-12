const assert = require('assert');
const { describe, it } = require('mocha');
const sudo = require('sudo-prompt');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const execAsync = (command, options) => new Promise((resolve, reject) => {
  sudo.exec(command, options, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    } else {
      resolve({ stdout, stderr });
    }
  });
});

describe('sudo', () => {
  it('default', async function () {
    this.timeout(60000);
    const options = {
      name: 'mmm',
    };
    const result = await execAsync('ifconfig en0 mtu 1500', options);
    console.log(result);
  });
});

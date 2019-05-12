const { describe, it } = require('mocha');
const exec = require('child_process').exec;

const keys = [
  'inet6',
  'inet',
  'prefixlen',
  'netmask',
  'scopeid',
  'nd6',
  'options',
  'ether',
  'broadcast',
  'media:',
  'status:',
  'member:',
  'id',
  'priority',
  'hellotime',
  'fwddelay',
  'maxage',
  'holdcnt',
  'proto',
  'maxaddr',
  'timeout',
  'ipfilter',
  'ifmaxaddr',
  'flags',
];

function parse(src) {
  const lines = src.split('\n');
  const blocks = [];
  let temp = [];
  lines.forEach((item) => {
    if (['\t', ' '].indexOf(item[0]) === -1 && temp.length > 0) {
      blocks.push(temp);
      temp = [];
    }
    temp.push(item);
  });

  return blocks.map((block) => {
    const ret = {};
    const firstline = block[0].toString();
    const coionIdx = firstline.indexOf(':');
    const conf = block.slice(1);
    const flagsline = firstline.slice(coionIdx + 1).trim();
    const flagsMh = flagsline.match(/^flags=[0-9]+<([A-Z,]*)> mtu ([0-9]+)/);

    ret.name = firstline.slice(0, coionIdx);
    ret.flags = flagsMh[1].split(',');
    ret.mtu = parseInt(flagsMh[2], 10);
    conf.forEach((item) => {
      const list = item.split(' ').filter(target => target.length > 0);
      let key = null;
      for (let i = 0; i < list.length; i += 1) {
        if (keys.indexOf(`${list[i]}`) !== -1) {
          key = (`${list[i]}`).replace(':', '');
          if (key && !ret[key]) ret[key] = true;
        } else if (key) {
          ret[key] = `${list[i]}`;
        }
      }
    });

    if (ret.flags.length && !ret.flags[0].length) {
      ret.flags = [];
    }

    return ret;
  });
}

const getNetworkConfig = () => new Promise((resolve, reject) => {
  exec('ifconfig', (error, stdout) => {
    if (error) {
      reject(error);
    } else {
      resolve(parse(stdout));
    }
  });
});

describe('parse ifconfig', () => {
  it('show result', async () => {
    const result = await getNetworkConfig();
    result.forEach((item) => {
      console.log(`${item.name}: ${item.mtu}`);
    });
  });
});

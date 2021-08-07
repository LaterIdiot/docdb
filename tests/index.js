import { DocClient, Db } from '../dist/index.js';

let data = {
  minecraftUUID: '927438989759847',
  muteActive: true,
};

data = {
  discordId: '927438989759847',
  muteActive: true,
};

data = {
  discordId: '927438989759847',
  muteActive: true,
  role: {
    id: '2894787589347589',
  },
};

const collection = new DocClient('private/data').db('database').collection('collection');

collection.find({ muteActive: true }).then(console.log);

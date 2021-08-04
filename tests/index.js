import { DocClient, Db } from '../dist/index.js';

const docClient = new DocClient('data')
  .db('database')
  .collection('collection')
  .insertOne({
    discordId: '927438989759847',
    muteActive: true,
    role: { id: '2894787589347589' },
  });

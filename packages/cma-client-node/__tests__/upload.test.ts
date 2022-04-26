import { Client, LogLevel } from '../src';
import { generateNewCmaClient } from './helpers/generateClients';

describe('upload', () => {
  let client: Client;

  beforeAll(async () => {
    client = await generateNewCmaClient();
  });

  test('upload local file', async () => {
    const upload = await client.uploads.createFromLocalFile({
      localPath: `${__dirname}/fixtures/text.txt`,
    });

    expect(upload.path.endsWith('text.txt')).toBeTruthy();
  });

  test('upload remote file', async () => {
    const upload = await client.uploads.createFromUrl({
      url: 'https://www.datocms-assets.com/205/1525789775-dato.png?w=16',
    });

    expect(upload.path.endsWith('dato.png')).toBeTruthy();
  });
});

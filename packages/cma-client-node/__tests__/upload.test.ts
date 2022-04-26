import { Client } from '../src';
import { generateNewCmaClient } from './helpers/generateClients';

describe('upload', () => {
  let client: Client;

  beforeAll(async () => {
    client = await generateNewCmaClient();
  });

  test('upload', async () => {
    const path = 'www.foo.bar/whoa.txt';

    const upload = await client.uploads.createFromLocalFile({
      localPath: './__tests__/fixtures/text.txt',
    });
    expect(upload.path.endsWith('whoa.txt')).toBeTruthy();
    const updatedUpload = await client.uploads.update(upload.id, {
      author: 'Mark Smith',
    });
    expect(updatedUpload.author).toEqual('Mark Smith');
  });
});

import { generateNewCmaClient } from './helpers/generateClients';

describe('upload request', () => {
  test('create', async () => {
    const client = await generateNewCmaClient();

    const uploadRequest = await client.uploadRequest.create({
      filename: 'test.svg',
    });
    expect(uploadRequest.id).not.toBeUndefined();
  });
});

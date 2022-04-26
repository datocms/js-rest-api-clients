import { SimpleSchemaTypes } from '../src';
import { generateNewCmaClient } from './helpers/generateClients';

describe('uploadTags', () => {
  test('smart tags and tags', async () => {
    const client = await generateNewCmaClient();
    const upload = await client.uploads.createFromLocalFile({
      localPath: `${__dirname}/fixtures/image.png`,
    });

    const tag = await client.uploadTags.create({ name: 'foo' });
    const updated = await client.uploads.update(upload, {
      tags: [tag.id],
    });
    expect(updated.tags[0]).toEqual(tag.id);

    const allTags: SimpleSchemaTypes.UploadTag[] = [];

    for await (const tag of client.uploadTags.listPagedIterator({
      filter: { query: 'foo' },
    })) {
      allTags.push(tag);
    }

    expect(allTags[0].name).toEqual('foo');

    const smartTags = await client.uploadSmartTags.list();
    expect(smartTags[0].name).toEqual('gray');
  });
});

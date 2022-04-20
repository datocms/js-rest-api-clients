import { Client } from '../src';
import { generateNewCmaClient } from './helpers/generateClients';

describe('upload', () => {
  let client: Client;

  beforeAll(async () => {
    client = await generateNewCmaClient();
  });

  test('update', async () => {
    // TODO createUploadPath
    // const path = await client.createUploadPath(
    //   'test/fixtures/newTextFileHttps.txt',
    //   { filename: 'whoa.txt' },
    // );

    const path = 'www.foo.bar/whoa.txt';

    const upload = await client.uploads.create({ path });
    expect(upload.path.endsWith('whoa.txt')).toBeTruthy();
    const updatedUpload = await client.uploads.update(upload.id, {
      author: 'Mark Smith',
    });
    expect(updatedUpload.author).toEqual('Mark Smith');
  });

  test('references', async () => {
    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
      singleton: true,
      modular_block: false,
      sortable: false,
      tree: false,
      draft_mode_active: false,
      ordering_direction: null,
      all_locales_required: true,
    });

    await client.fields.create(itemType, {
      label: 'Image',
      field_type: 'file',
      localized: false,
      api_key: 'image',
      validators: { required: {} },
    });

    // const path = await client.createUploadPath(
    //   'https://www.w3.org/People/mimasa/test/imgformat/img/w3c_home.jpg',
    // );
    const path = 'www.foo.bar/whoa.txt';

    const upload = await client.uploads.create({
      path,
    });

    type RecordTestType = {
      image: { uploadId: string };
    };

    await client.items.create({
      ...({ image: { uploadId: upload.id } } as RecordTestType),
      item_type: itemType,
    });

    const items = await client.uploads.references(upload.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((items[0].image as any).uploadId).toEqual(upload.id);
  });
});

import { generateNewCmaClient } from './helpers/generateClients';

describe('upload', () => {
  test('all methods', async () => {
    const client = await generateNewCmaClient();

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

      await client.fields.create(itemType.id, {
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

      // TODO: qui ItemCreateSchema non dovrebbe avere item_type.data
      await client.items.create({
        ...({ image: { uploadId: upload.id } } as RecordTestType),
        item_type: { data: { id: itemType.id, type: 'item_type' } },
      });

      const items = await client.uploads.references(upload.id);

      expect(items[0].image.uploadId).toEqual(upload.id);
    });
  });
});

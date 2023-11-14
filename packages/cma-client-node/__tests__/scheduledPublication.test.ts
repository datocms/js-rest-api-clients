import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('scheduledPublication', () => {
  it.concurrent('publish, unpublish', async () => {
    const client = await generateNewCmaClient();
    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'blog_post',
    });

    await client.fields.create(itemType.id, {
      label: 'Title',
      field_type: 'string',
      localized: false,
      api_key: 'title',
      validators: { required: {} },
    });

    const date = '2018-11-24T10:00';

    const item = await client.items.create({
      title: 'My first blog post',
      item_type: itemType,
      meta: {
        created_at: date,
        first_published_at: date,
        updated_at: date,
        published_at: date,
      },
    });

    const scheduledPublicationItem = await client.scheduledPublication.create(
      item,
      {
        publication_scheduled_at: '2056-02-10T11:03:42.208Z',
      },
    );
    expect(scheduledPublicationItem.publication_scheduled_at).toEqual(
      '2056-02-10T11:03:42.208Z',
    );

    const unScheduledPublicationItem =
      await client.scheduledPublication.destroy(item);
    expect(unScheduledPublicationItem.publication_scheduled_at).toEqual(
      undefined,
    );

    const itemToBeUnpublished = await client.scheduledUnpublishing.create(
      item,
      {
        unpublishing_scheduled_at: '2056-02-10T11:03:42.208Z',
      },
    );
    expect(itemToBeUnpublished.unpublishing_scheduled_at).toEqual(
      '2056-02-10T11:03:42.208Z',
    );

    const itemNotToBeUnpublished = await client.scheduledUnpublishing.destroy(
      item,
    );
    expect(itemNotToBeUnpublished.unpublishing_scheduled_at).toEqual(undefined);
  });
});

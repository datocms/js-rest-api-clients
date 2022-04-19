import { generateNewCmaClient } from './helpers/generateClients';

describe('item type', () => {
  test('create, find, all, duplicate, update, destroy', async () => {
    const client = await generateNewCmaClient();

    // TODO Error: POST https://site-api.datocms.com/item-types: 422 Unprocessable Entity (INVALID_FORMAT, {"messages":["#/data/attributes: failed schema #/definitions/item_type/links/0/schema/properties/data/properties/attributes: \"ordering_field\", \"title_field\" are not permitted keys."]})
    const myModel = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
      singleton: true,
      sortable: false,
      modular_block: false,
      tree: false,
      ordering_direction: null,
      draft_mode_active: false,
      all_locales_required: true,
      ordering_field: null,
      title_field: null,
    });
    expect(myModel.name).toEqual('Article');

    const foundItemType = await client.itemTypes.find(myModel.id);
    expect(foundItemType.id).toEqual(myModel.id);

    const duplicated = await client.itemTypes.duplicate(myModel.id);
    expect(duplicated.name).toEqual('Article (copy #1)');

    const allItemTypes = await client.itemTypes.list();
    expect(allItemTypes).toHaveLength(2);

    const field = await client.fields.create(myModel.id, {
      label: 'Title',
      api_key: 'title',
      field_type: 'string',
    });
    expect(field.label).toEqual('Title');

    const updatedItemType = await client.itemTypes.update(myModel.id, {
      name: 'UpdatedArticle',
      title_field: {
        type: 'field',
        id: field.id,
      },
    });
    expect(updatedItemType.name).toEqual('UpdatedArticle');
    expect(
      updatedItemType.title_field && updatedItemType.title_field.id,
    ).toEqual(field.id);

    await client.itemTypes.destroy(myModel.id);
  });
});

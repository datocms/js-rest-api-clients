import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import type { ItemTypeDefinition } from '../src';
import {
  SchemaRepository,
  buildBlockRecord,
  everyBlockInNonLocalizedFieldValue,
  filterBlocksInNonLocalizedFieldValue,
  findAllBlocksInNonLocalizedFieldValue,
  mapBlocksInNonLocalizedFieldValue,
  reduceBlocksInNonLocalizedFieldValue,
  someBlocksInNonLocalizedFieldValue,
  visitBlocksInNonLocalizedFieldValue,
} from '../src';

describe('Recursive block utilities', () => {
  it('should test all recursive block utility functions', async () => {
    const client = await generateNewCmaClient();

    const blockModel2 = await client.itemTypes.create({
      id: 'NpxVXHP0RcaCs25vuSuKSQ',
      name: 'Block 1',
      api_key: 'first_block',
      modular_block: true,
    });

    await client.fields.create(blockModel2.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'name',
    });

    await client.fields.create(blockModel2.id, {
      label: 'Modular content',
      field_type: 'rich_text',
      api_key: 'rich_text',
      validators: {
        rich_text_blocks: {
          item_types: [blockModel2.id],
        },
      },
    });

    const blockModel1 = await client.itemTypes.create({
      id: 'T4m4tPymSACFzsqbZS65WA',
      name: 'Block 2',
      api_key: 'second_block',
      modular_block: true,
    });

    await client.fields.create(blockModel1.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    await client.fields.create(blockModel1.id, {
      label: 'Modular content',
      field_type: 'rich_text',
      api_key: 'rich_text',
      validators: {
        rich_text_blocks: {
          item_types: [blockModel2.id],
        },
      },
    });

    const productModel = await client.itemTypes.create({
      id: 'UZyfjdBES8y2W2ruMEHSoA',
      name: 'Product',
      api_key: 'product',
    });

    await client.fields.create(productModel.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    await client.fields.create(productModel.id, {
      label: 'Modular content',
      field_type: 'rich_text',
      api_key: 'rich_text',
      validators: {
        rich_text_blocks: {
          item_types: [blockModel1.id],
        },
      },
    });

    type EnvSettings = { locales: 'en' };

    type Product = ItemTypeDefinition<
      EnvSettings,
      'UZyfjdBES8y2W2ruMEHSoA',
      {
        title: { type: 'string' };
        rich_text: { type: 'rich_text'; blocks: Block1 };
      }
    >;

    type Block1 = ItemTypeDefinition<
      EnvSettings,
      'T4m4tPymSACFzsqbZS65WA',
      {
        title: { type: 'string' };
        rich_text: { type: 'rich_text'; blocks: Block2 };
      }
    >;

    type Block2 = ItemTypeDefinition<
      EnvSettings,
      'NpxVXHP0RcaCs25vuSuKSQ',
      {
        name: { type: 'string' };
        rich_text: { type: 'rich_text'; blocks: Block1 };
      }
    >;

    const record = await client.items.create<Product>({
      item_type: { type: 'item_type', id: 'UZyfjdBES8y2W2ruMEHSoA' },
      title: 'Level 0',
      rich_text: [
        buildBlockRecord<Block1>({
          item_type: { type: 'item_type', id: 'T4m4tPymSACFzsqbZS65WA' },
          title: 'Level 1',
          rich_text: [
            buildBlockRecord<Block2>({
              item_type: { type: 'item_type', id: 'NpxVXHP0RcaCs25vuSuKSQ' },
              name: 'Level 2',
            }),
          ],
        }),
      ],
    });

    const schemaRepository = new SchemaRepository(client);

    const recordInNestedResponse = await client.items.find<Product>(record, {
      nested: true,
    });

    // Test visitBlocksInNonLocalizedFieldValue
    const visitedBlocks: Array<{ title: string | null; path: string }> = [];
    await visitBlocksInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block, path) => {
        if (block.__itemTypeId === 'T4m4tPymSACFzsqbZS65WA') {
          visitedBlocks.push({
            title: block.attributes.title,
            path: path.join('.'),
          });
        } else if (block.__itemTypeId === 'NpxVXHP0RcaCs25vuSuKSQ') {
          visitedBlocks.push({
            title: block.attributes.name,
            path: path.join('.'),
          });
        }
      },
    );
    expect(visitedBlocks).toHaveLength(2);
    expect(visitedBlocks[0]).toEqual({ title: 'Level 1', path: '0' });
    expect(visitedBlocks[1]).toEqual({
      title: 'Level 2',
      path: '0.attributes.rich_text.0',
    });

    // Test findAllBlocksInNonLocalizedFieldValue
    const foundBlocks = await findAllBlocksInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) =>
        block.__itemTypeId === 'NpxVXHP0RcaCs25vuSuKSQ' &&
        block.attributes.name === 'Level 2',
    );

    expect(foundBlocks).toHaveLength(1);
    const foundBlock = foundBlocks[0]!;
    expect(foundBlock.item.__itemTypeId).toBe('NpxVXHP0RcaCs25vuSuKSQ');
    if (foundBlock.item.__itemTypeId !== 'NpxVXHP0RcaCs25vuSuKSQ')
      throw new Error('Type narrowing');
    expect(foundBlock.item.attributes.name).toBe('Level 2');
    expect(foundBlocks[0]!.path.join('.')).toBe('0.attributes.rich_text.0');

    // Test filterBlocksInNonLocalizedFieldValue
    const filteredValue = await filterBlocksInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) =>
        block.__itemTypeId === 'T4m4tPymSACFzsqbZS65WA' &&
        block.attributes.title === 'Level 1',
    );
    expect(Array.isArray(filteredValue)).toBe(true);
    expect(filteredValue.length).toBe(1);
    const filteredBlock = filteredValue[0]!;
    expect(filteredBlock.__itemTypeId).toBe('T4m4tPymSACFzsqbZS65WA');
    if (filteredBlock.__itemTypeId !== 'T4m4tPymSACFzsqbZS65WA')
      throw new Error('Type narrowing');
    expect(filteredValue[0]!.attributes.title).toBe('Level 1');
    expect(filteredValue[0]!.attributes.rich_text).toHaveLength(0);

    // Test reduceBlocksInNonLocalizedFieldValue
    const titleCount = await reduceBlocksInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (acc, block) => {
        if (
          'title' in block.attributes
            ? block.attributes.title
            : block.attributes.name
        ) {
          return acc + 1;
        }
        return acc;
      },
      0,
    );
    expect(titleCount).toBe(2);

    // Test someBlocksInNonLocalizedFieldValue
    const hasLevel2 = await someBlocksInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) =>
        block.__itemTypeId === 'NpxVXHP0RcaCs25vuSuKSQ' &&
        block.attributes.name === 'Level 2',
    );
    expect(hasLevel2).toBe(true);

    const hasLevel3 = await someBlocksInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) =>
        block.__itemTypeId === 'T4m4tPymSACFzsqbZS65WA' &&
        block.attributes.title === 'Level 3',
    );
    expect(hasLevel3).toBe(false);

    // Test everyBlockInNonLocalizedFieldValue
    const allHaveTitles = await everyBlockInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) =>
        block.__itemTypeId !== 'T4m4tPymSACFzsqbZS65WA' ||
        !!block.attributes.title,
    );
    expect(allHaveTitles).toBe(true);

    const allAreLevel1 = await everyBlockInNonLocalizedFieldValue(
      recordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) => block.__itemTypeId === 'T4m4tPymSACFzsqbZS65WA',
    );
    expect(allAreLevel1).toBe(false);
  });

  it('mapBlocksInNonLocalizedFieldValue()', async () => {
    const client = await generateNewCmaClient();

    const blockModel = await client.itemTypes.create({
      id: 'T4m4tPymSACFzsqbZS65WA',
      name: 'Content Block',
      api_key: 'content_block',
      modular_block: true,
    });

    await client.fields.create(blockModel.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    await client.fields.create(blockModel.id, {
      label: 'Modular content',
      field_type: 'rich_text',
      api_key: 'rich_text',
      validators: {
        rich_text_blocks: {
          item_types: [blockModel.id],
        },
      },
    });

    const productModel = await client.itemTypes.create({
      id: 'UZyfjdBES8y2W2ruMEHSoA',
      name: 'Product',
      api_key: 'product',
    });

    await client.fields.create(productModel.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    await client.fields.create(productModel.id, {
      label: 'Modular content',
      field_type: 'rich_text',
      api_key: 'rich_text',
      validators: {
        rich_text_blocks: {
          item_types: [blockModel.id],
        },
      },
    });

    type EnvSettings = { locales: 'en' };

    type Product = ItemTypeDefinition<
      EnvSettings,
      'UZyfjdBES8y2W2ruMEHSoA',
      {
        title: { type: 'string' };
        rich_text: { type: 'rich_text'; blocks: Block };
      }
    >;

    type Block = ItemTypeDefinition<
      EnvSettings,
      'T4m4tPymSACFzsqbZS65WA',
      {
        title: { type: 'string' };
        rich_text: { type: 'rich_text'; blocks: Block };
      }
    >;

    const record = await client.items.create<Product>({
      item_type: { type: 'item_type', id: 'UZyfjdBES8y2W2ruMEHSoA' },
      title: 'Level 0',
      rich_text: [
        buildBlockRecord<Block>({
          item_type: { type: 'item_type', id: 'T4m4tPymSACFzsqbZS65WA' },
          title: 'Level 1',
          rich_text: [
            buildBlockRecord<Block>({
              item_type: { type: 'item_type', id: 'T4m4tPymSACFzsqbZS65WA' },
              title: 'Level 2',
            }),
          ],
        }),
      ],
    });

    const schemaRepository = new SchemaRepository(client);

    const recordInNestedResponse = await client.items.find<Product>(record, {
      nested: true,
    });

    // Test that demonstrates how traversal direction affects mapBlocksInNonLocalizedFieldValue
    // This test shows that in top-down, the parent transformation happens BEFORE children are processed
    // In bottom-up, children are processed FIRST, then parent gets the already-processed children

    // Create a more complex nested structure for better testing
    const complexRecord = await client.items.create<Product>({
      item_type: { type: 'item_type', id: 'UZyfjdBES8y2W2ruMEHSoA' },
      title: 'Root',
      rich_text: [
        buildBlockRecord<Block>({
          item_type: { type: 'item_type', id: 'T4m4tPymSACFzsqbZS65WA' },
          title: 'Parent',
          rich_text: [
            buildBlockRecord<Block>({
              item_type: { type: 'item_type', id: 'T4m4tPymSACFzsqbZS65WA' },
              title: 'Child',
              rich_text: [
                buildBlockRecord<Block>({
                  item_type: {
                    type: 'item_type',
                    id: 'T4m4tPymSACFzsqbZS65WA',
                  },
                  title: 'Grandchild',
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const complexRecordInNestedResponse = await client.items.find<Product>(
      complexRecord,
      {
        nested: true,
      },
    );

    // Test that demonstrates the actual functional difference between traversal directions
    // We'll use a mapper that creates different results based on whether children have been processed

    // Top-down test: mapper sees children in their original state
    const topDownMappedValue = (await mapBlocksInNonLocalizedFieldValue(
      complexRecordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) => {
        // Count how many children have already been transformed (have "TRANSFORMED" in title)
        const transformedChildrenCount = Array.isArray(
          block.attributes.rich_text,
        )
          ? block.attributes.rich_text.filter((child) =>
              child.attributes?.title?.includes('TRANSFORMED'),
            ).length
          : 0;

        return {
          ...block,
          attributes: {
            ...block.attributes,
            title: `TRANSFORMED-${block.attributes.title}-TopDown-Children:${transformedChildrenCount}`,
          },
        };
      },
      { traversalDirection: 'top-down' },
    )) as typeof complexRecordInNestedResponse.rich_text;

    // Bottom-up test: mapper sees children after they've been processed
    const bottomUpMappedValue = (await mapBlocksInNonLocalizedFieldValue(
      complexRecordInNestedResponse.rich_text,
      'rich_text',
      schemaRepository,
      (block) => {
        // Count how many children have already been transformed (have "TRANSFORMED" in title)
        const transformedChildrenCount = Array.isArray(
          block.attributes.rich_text,
        )
          ? block.attributes.rich_text.filter((child) =>
              child.attributes?.title?.includes('TRANSFORMED'),
            ).length
          : 0;

        return {
          ...block,
          attributes: {
            ...block.attributes,
            title: `TRANSFORMED-${block.attributes.title}-BottomUp-Children:${transformedChildrenCount}`,
          },
        };
      },
      { traversalDirection: 'bottom-up' },
    )) as typeof complexRecordInNestedResponse.rich_text;

    // In top-down, parents are processed before children, so they see 0 transformed children
    expect(topDownMappedValue[0]!.attributes.title).toBe(
      'TRANSFORMED-Parent-TopDown-Children:0',
    );
    expect(
      topDownMappedValue[0]!.attributes.rich_text[0]!.attributes.title,
    ).toBe('TRANSFORMED-Child-TopDown-Children:0');
    expect(
      topDownMappedValue[0]!.attributes.rich_text[0]!.attributes.rich_text[0]!
        .attributes.title,
    ).toBe('TRANSFORMED-Grandchild-TopDown-Children:0');

    // In bottom-up, children are processed first, so parents see transformed children
    expect(bottomUpMappedValue[0]!.attributes.title).toBe(
      'TRANSFORMED-Parent-BottomUp-Children:1',
    );
    expect(
      bottomUpMappedValue[0]!.attributes.rich_text[0]!.attributes.title,
    ).toBe('TRANSFORMED-Child-BottomUp-Children:1');
    expect(
      bottomUpMappedValue[0]!.attributes.rich_text[0]!.attributes.rich_text[0]!
        .attributes.title,
    ).toBe('TRANSFORMED-Grandchild-BottomUp-Children:0');
  });
});

import assert from 'node:assert';
import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import type { ApiTypes } from '../src';
import {
  type LocalizedFieldValue,
  SchemaRepository,
  buildBlockRecord,
  isItemWithOptionalMeta,
  isLocalized,
  mapBlocksInNonLocalizedFieldValue,
  mapNormalizedFieldValuesAsync,
} from '../src';

describe('utilities test', () => {
  it('should correctly process localized fields and duplicate content using utility functions', async () => {
    // This test validates the following utility functions:
    // - mapNormalizedFieldValuesAsync: processes localized field values with async mappers
    // - mapBlocksInNonLocalizedFieldValue: processes blocks in non-localized field values
    // - isLocalized: checks if a field is localized
    // - isItemWithOptionalMeta: type guard for block items
    // - SchemaRepository: provides schema information for recursive block processing
    //
    // Test scenario:
    // 1. Create models with localized string, text, and rich_text fields
    // 2. Create items with English and German content
    // 3. Use utilities to:
    //    - Convert existing locale blocks to IDs (for update efficiency)
    //    - Duplicate English content to Austrian English with new block instances
    // 4. Verify the utilities work correctly for all field types

    const client = await generateNewCmaClient();

    // Update site with required locales including Austrian English
    await client.site.update({ locales: ['en', 'de', 'en-AT'] });

    // Create a ContentBlock model for rich text content
    const contentBlockModel = await client.itemTypes.create({
      id: 'T4m4tPymSACFzsqbZS65WA',
      name: 'Content Block',
      api_key: 'content_block',
      modular_block: true,
    });

    await client.fields.create(contentBlockModel.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    await client.fields.create(contentBlockModel.id, {
      label: 'Description',
      field_type: 'text',
      api_key: 'description',
    });

    // Create a Product model with localized fields
    const productModel = await client.itemTypes.create({
      id: 'UZyfjdBES8y2W2ruMEHSoA',
      name: 'Product',
      api_key: 'product',
    });

    await client.fields.create(productModel.id, {
      label: 'Name',
      field_type: 'string',
      api_key: 'name',
      localized: true,
    });

    await client.fields.create(productModel.id, {
      label: 'Description',
      field_type: 'text',
      api_key: 'description',
      localized: true,
    });

    await client.fields.create(productModel.id, {
      label: 'Features',
      field_type: 'rich_text',
      api_key: 'features',
      localized: true,
      validators: {
        rich_text_blocks: {
          item_types: [contentBlockModel.id],
        },
      },
    });

    await client.fields.create(productModel.id, {
      label: 'Price',
      field_type: 'float',
      api_key: 'price',
    });

    // Create a BlogPost model with localized fields
    const blogPostModel = await client.itemTypes.create({
      id: 'JItInCQJSIeCLX3oGPvN1w',
      name: 'Blog Post',
      api_key: 'blog_post',
    });

    await client.fields.create(blogPostModel.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
      localized: true,
    });

    await client.fields.create(blogPostModel.id, {
      label: 'Content',
      field_type: 'text',
      api_key: 'content',
      localized: true,
    });

    // Create sample products with English and German content (en-AT will be duplicated from en)
    await client.items.create({
      item_type: { type: 'item_type', id: productModel.id },
      name: {
        en: 'Premium Wireless Headphones',
        de: 'Premium Kabellose Kopfhörer',
      },
      description: {
        en: 'Experience crystal-clear audio with our top-of-the-line wireless headphones featuring noise cancellation.',
        de: 'Erleben Sie kristallklaren Klang mit unseren hochwertigen kabellosen Kopfhörern mit Geräuschunterdrückung.',
      },
      features: {
        en: [
          buildBlockRecord({
            item_type: { type: 'item_type', id: contentBlockModel.id },
            title: 'Active Noise Cancellation',
            description:
              'Block out unwanted noise with our advanced ANC technology.',
          }),
          buildBlockRecord({
            item_type: { type: 'item_type', id: contentBlockModel.id },
            title: '30-Hour Battery Life',
            description: 'All-day listening with fast charging capabilities.',
          }),
        ],
        de: [
          buildBlockRecord({
            item_type: { type: 'item_type', id: contentBlockModel.id },
            title: 'Aktive Geräuschunterdrückung',
            description:
              'Blockieren Sie unerwünschte Geräusche mit unserer fortschrittlichen ANC-Technologie.',
          }),
          buildBlockRecord({
            item_type: { type: 'item_type', id: contentBlockModel.id },
            title: '30 Stunden Akkulaufzeit',
            description: 'Ganztägiges Hören mit Schnellladefunktion.',
          }),
        ],
      },
      price: 299.99,
    });

    await client.items.create({
      item_type: { type: 'item_type', id: productModel.id },
      name: {
        en: 'Smart Fitness Tracker',
        de: 'Intelligenter Fitness-Tracker',
      },
      description: {
        en: 'Track your health and fitness goals with precision using our advanced wearable technology.',
        de: 'Verfolgen Sie Ihre Gesundheits- und Fitnessziele präzise mit unserer fortschrittlichen Wearable-Technologie.',
      },
      features: {
        en: [
          buildBlockRecord({
            item_type: { type: 'item_type', id: contentBlockModel.id },
            title: 'Heart Rate Monitoring',
            description: 'Continuous heart rate tracking throughout the day.',
          }),
        ],
        de: [
          buildBlockRecord({
            item_type: { type: 'item_type', id: contentBlockModel.id },
            title: 'Herzfrequenzüberwachung',
            description:
              'Kontinuierliche Herzfrequenzüberwachung den ganzen Tag über.',
          }),
        ],
      },
      price: 149.99,
    });

    // Create sample blog posts
    await client.items.create({
      item_type: { type: 'item_type', id: blogPostModel.id },
      title: {
        en: 'The Future of Wearable Technology',
        de: 'Die Zukunft der Wearable-Technologie',
      },
      content: {
        en: 'Wearable technology continues to evolve, bringing new possibilities for health monitoring and personal productivity. From smartwatches to fitness trackers, these devices are becoming integral parts of our daily lives.',
        de: 'Die Wearable-Technologie entwickelt sich weiter und eröffnet neue Möglichkeiten für Gesundheitsüberwachung und persönliche Produktivität. Von Smartwatches bis hin zu Fitness-Trackern werden diese Geräte zu integralen Bestandteilen unseres täglichen Lebens.',
      },
    });

    await client.items.create({
      item_type: { type: 'item_type', id: blogPostModel.id },
      title: {
        en: 'Audio Innovation in 2024',
        de: 'Audio-Innovation 2024',
      },
      content: {
        en: 'This year marks significant advances in audio technology, with improvements in noise cancellation, battery life, and sound quality reaching new heights.',
        de: 'Dieses Jahr markiert bedeutende Fortschritte in der Audiotechnologie, wobei Verbesserungen bei Geräuschunterdrückung, Akkulaufzeit und Klangqualität neue Höhen erreichen.',
      },
    });

    const schemaRepository = new SchemaRepository(client);

    // Iterate through all content models
    for (const model of await schemaRepository.getAllModels()) {
      const fields = await schemaRepository.getItemTypeFields(model);
      const localizedFields = fields.filter(isLocalized);

      // Process all records of this model type
      for await (const record of client.items.listPagedIterator({
        filter: { type: model.api_key },
        version: 'current',
        nested: true, // Important: get full block objects, not just IDs!
      })) {
        const updatePayload: ApiTypes.ItemUpdateSchema = {};
        let hasChanges = false;

        for (const field of localizedFields) {
          const fieldValueInNestedResponse = record[
            field.api_key
          ] as LocalizedFieldValue;

          // Skip if en content doesn't exist
          if (!fieldValueInNestedResponse.en) {
            continue;
          }

          // Test that original field has expected locales
          expect(fieldValueInNestedResponse.en).toBeDefined();
          expect(fieldValueInNestedResponse.de).toBeDefined();
          expect(fieldValueInNestedResponse['en-AT']).toBeUndefined();

          // Process the locales by converting any full block object to just IDs
          const newFieldValue = (await mapNormalizedFieldValuesAsync(
            fieldValueInNestedResponse,
            field,
            async (
              _locale: string | undefined,
              fieldValueForLocale: unknown,
            ) => {
              const result = await mapBlocksInNonLocalizedFieldValue(
                fieldValueForLocale,
                field.field_type,
                schemaRepository,
                (block) => {
                  assert(isItemWithOptionalMeta(block));
                  // Passing just the ID => "Keep the existing block unchanged"
                  return block.id;
                },
              );

              // Test that mapBlocksInNonLocalizedFieldValue works correctly
              if (
                field.field_type === 'string' ||
                field.field_type === 'text'
              ) {
                // For simple fields, should return the original value unchanged
                expect(result).toEqual(fieldValueForLocale);
              } else if (
                field.field_type === 'rich_text' &&
                Array.isArray(result)
              ) {
                // For rich_text fields, should convert blocks to IDs
                for (const item of result) {
                  expect(typeof item).toBe('string'); // Should be ID strings
                }
              }

              return result;
            },
          )) as LocalizedFieldValue;

          // Test that mapNormalizedFieldValuesAsync preserves existing locales
          expect(Object.keys(newFieldValue)).toEqual(
            Object.keys(fieldValueInNestedResponse),
          );

          // Duplicate en content and assign it as en-AT
          // Use recursive mapping to remove IDs from any block
          newFieldValue['en-AT'] = await mapBlocksInNonLocalizedFieldValue(
            fieldValueInNestedResponse.en,
            field.field_type,
            schemaRepository,
            (block) => {
              assert(isItemWithOptionalMeta(block));
              // Block with no ID => "Create new block instance"
              const { id, ...blockWithoutId } = block;
              return blockWithoutId;
            },
          );

          updatePayload[field.api_key] = newFieldValue;

          hasChanges = true;
        }

        // Update the record if there are changes
        if (hasChanges) {
          // Test expectations before update
          for (const field of localizedFields) {
            const fieldValue = updatePayload[
              field.api_key
            ] as LocalizedFieldValue;

            // Should have original locales preserved
            expect(fieldValue.en).toBeDefined();
            expect(fieldValue.de).toBeDefined();

            // Should have new en-AT locale added
            expect(fieldValue['en-AT']).toBeDefined();

            // For simple fields, en-AT should equal en
            if (field.field_type === 'string' || field.field_type === 'text') {
              expect(fieldValue['en-AT']).toEqual(fieldValue.en);
            }

            // For rich_text fields, en-AT should have new block instances (no IDs)
            if (
              field.field_type === 'rich_text' &&
              Array.isArray(fieldValue['en-AT'])
            ) {
              // Should have same number of blocks as en
              expect(fieldValue['en-AT']).toHaveLength(
                (fieldValue.en as any[]).length,
              );

              for (const block of fieldValue['en-AT'] as any[]) {
                expect(block.id).toBeUndefined();
                expect(block.attributes).toBeDefined();
                expect(block.relationships).toBeDefined();
              }
            }
          }

          await client.items.update(record.id, updatePayload);

          const nestedRecord = await client.items.find(record.id, {
            nested: true,
          });

          // Test expectations after update
          for (const field of localizedFields) {
            const fieldValue = nestedRecord[
              field.api_key
            ] as LocalizedFieldValue;

            // Should have all three locales
            expect(fieldValue.en).toBeDefined();
            expect(fieldValue.de).toBeDefined();
            expect(fieldValue['en-AT']).toBeDefined();

            // en-AT should have same content as en (but different IDs for rich_text)
            if (field.field_type === 'string' || field.field_type === 'text') {
              expect(fieldValue['en-AT']).toEqual(fieldValue.en);
            } else if (
              field.field_type === 'rich_text' &&
              Array.isArray(fieldValue['en-AT'])
            ) {
              // Should have same number of blocks
              expect(fieldValue['en-AT']).toHaveLength(
                (fieldValue.en as any[]).length,
              );

              // Each block should have different ID but same content
              for (let i = 0; i < (fieldValue['en-AT'] as any[]).length; i++) {
                const enBlock = (fieldValue.en as any[])[i];
                const enAtBlock = (fieldValue['en-AT'] as any[])[i];

                expect(enAtBlock.id).toBeDefined();
                expect(enAtBlock.id).not.toEqual(enBlock.id);
                expect(enAtBlock.attributes).toEqual(enBlock.attributes);
              }
            }
          }
        }
      }
    }
  });
});

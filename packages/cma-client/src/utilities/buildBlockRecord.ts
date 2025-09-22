import * as Utils from '@datocms/rest-client-utils';
import type { NewBlockInARequest } from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import { Item } from '../generated/resources';
import type {
  ItemTypeDefinition,
  ToItemDefinitionAsRequest,
} from './itemDefinition';

type NoInfer<T> = [T][T extends any ? 0 : never];

export function buildBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  body: ApiTypes.ItemUpdateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
): NewBlockInARequest<ToItemDefinitionAsRequest<NoInfer<D>>> {
  return Utils.serializeRequestBody<{
    data: NewBlockInARequest<ToItemDefinitionAsRequest<NoInfer<D>>>;
  }>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}

type Block = ItemTypeDefinition<
  { locales: 'it' },
  'WTyssHtyTzu9_EbszSVhPw',
  {
    title: { type: 'string' };
    rich_text: { type: 'rich_text'; blocks: Block };
    structured_text: {
      type: 'structured_text';
      blocks: Block;
      inline_blocks: Block;
    };
    single_block: { type: 'single_block'; blocks: Block };
  }
>;

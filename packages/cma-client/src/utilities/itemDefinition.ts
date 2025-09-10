import type {
  BooleanFieldValue,
  ColorFieldValue,
  DateFieldValue,
  DateTimeFieldValue,
  FileFieldValue,
  FloatFieldValue,
  GalleryFieldValue,
  IntegerFieldValue,
  JsonFieldValue,
  LatLonFieldValue,
  LinkFieldValue,
  LinksFieldValue,
  RichTextFieldValue,
  RichTextFieldValueAsRequest,
  RichTextFieldValueWithNestedBlocks,
  SeoFieldValue,
  SingleBlockFieldValue,
  SingleBlockFieldValueAsRequest,
  SingleBlockFieldValueWithNestedBlocks,
  SlugFieldValue,
  StringFieldValue,
  StructuredTextFieldValue,
  StructuredTextFieldValueAsRequest,
  StructuredTextFieldValueWithNestedBlocks,
  TextFieldValue,
  VideoFieldValue,
} from '../fieldTypes';
import type { LocalizedFieldValue } from './fieldValue';

/** Base field definition */
type BaseFieldDefinition<Type extends string> = {
  type: Type;
  localized?: boolean;
};

type RichTextFieldDefinition<
  AllowedBlocks extends ItemTypeDefinition = ItemTypeDefinition,
> = BaseFieldDefinition<'rich_text'> & { blocks: AllowedBlocks };
type SingleBlockFieldDefinition<
  AllowedBlocks extends ItemTypeDefinition = ItemTypeDefinition,
> = BaseFieldDefinition<'single_block'> & { blocks: AllowedBlocks };
type StructuredTextFieldDefinition<
  AllowedBlocks extends ItemTypeDefinition = ItemTypeDefinition,
  AllowedInlineBlocks extends ItemTypeDefinition = ItemTypeDefinition,
> = BaseFieldDefinition<'structured_text'> & {
  blocks: AllowedBlocks;
  inline_blocks: AllowedInlineBlocks;
};

/** Field definition union */
export type FieldDefinition =
  | BaseFieldDefinition<
      | 'boolean'
      | 'color'
      | 'date'
      | 'date_time'
      | 'file'
      | 'float'
      | 'gallery'
      | 'integer'
      | 'json'
      | 'lat_lon'
      | 'link'
      | 'links'
      | 'seo'
      | 'slug'
      | 'string'
      | 'text'
      | 'video'
      | 'unknown'
    >
  | RichTextFieldDefinition
  | SingleBlockFieldDefinition
  | StructuredTextFieldDefinition;

/** Item type definition */
export type ItemTypeDefinition<
  ItemTypeId extends string = string,
  FieldDefinitions extends Record<string, FieldDefinition> = {},
> = {
  itemTypeId: ItemTypeId;
  fields: FieldDefinitions;
};

/** Item definition */
export type ItemDefinition<
  ItemTypeId extends string = string,
  FieldValues extends Record<string, unknown> = Record<string, unknown>,
> = {
  itemTypeId: ItemTypeId;
  fields: FieldValues;
};

/** Standard field values */
type FieldTypeToValue = {
  boolean: BooleanFieldValue;
  color: ColorFieldValue;
  date: DateFieldValue;
  date_time: DateTimeFieldValue;
  file: FileFieldValue;
  float: FloatFieldValue;
  gallery: GalleryFieldValue;
  integer: IntegerFieldValue;
  json: JsonFieldValue;
  lat_lon: LatLonFieldValue;
  link: LinkFieldValue;
  links: LinksFieldValue;
  rich_text: RichTextFieldValue;
  seo: SeoFieldValue;
  single_block: SingleBlockFieldValue;
  slug: SlugFieldValue;
  string: StringFieldValue;
  structured_text: StructuredTextFieldValue;
  text: TextFieldValue;
  video: VideoFieldValue;
  unknown: unknown;
};

/** Localized wrapper */
type LocalizeIfNeeded<T extends FieldDefinition, Value> = T extends {
  localized: true;
}
  ? LocalizedFieldValue<Value>
  : Value;

/** Standard mapping */
type FieldDefinitionToFieldValue<T extends FieldDefinition> = LocalizeIfNeeded<
  T,
  FieldTypeToValue[T['type']]
>;

/** AsRequest mapping (block fields become generic over allowed blocks) */
type FieldDefinitionToFieldValueAsRequest<T extends FieldDefinition> =
  T extends RichTextFieldDefinition<infer B>
    ? LocalizeIfNeeded<
        T,
        RichTextFieldValueAsRequest<
          ItemTypeDefinitionToItemDefinitionAsRequest<B>
        >
      >
    : T extends SingleBlockFieldDefinition<infer B>
      ? LocalizeIfNeeded<
          T,
          SingleBlockFieldValueAsRequest<
            ItemTypeDefinitionToItemDefinitionAsRequest<B>
          >
        >
      : T extends StructuredTextFieldDefinition<infer B, infer I>
        ? LocalizeIfNeeded<
            T,
            StructuredTextFieldValueAsRequest<
              ItemTypeDefinitionToItemDefinitionAsRequest<B>,
              ItemTypeDefinitionToItemDefinitionAsRequest<I>
            >
          >
        : LocalizeIfNeeded<T, FieldTypeToValue[T['type']]>;

type FieldDefinitionToFieldValueWithNestedBlocks<T extends FieldDefinition> =
  T extends RichTextFieldDefinition<infer B>
    ? LocalizeIfNeeded<
        T,
        RichTextFieldValueWithNestedBlocks<
          ItemTypeDefinitionToItemDefinitionWithNestedBlocks<B>
        >
      >
    : T extends SingleBlockFieldDefinition<infer B>
      ? LocalizeIfNeeded<
          T,
          SingleBlockFieldValueWithNestedBlocks<
            ItemTypeDefinitionToItemDefinitionWithNestedBlocks<B>
          >
        >
      : T extends StructuredTextFieldDefinition<infer B, infer I>
        ? LocalizeIfNeeded<
            T,
            StructuredTextFieldValueWithNestedBlocks<
              ItemTypeDefinitionToItemDefinitionWithNestedBlocks<B>,
              ItemTypeDefinitionToItemDefinitionWithNestedBlocks<I>
            >
          >
        : LocalizeIfNeeded<T, FieldTypeToValue[T['type']]>;

/** Transformers */
export type ItemTypeDefinitionToItemDefinition<T extends ItemTypeDefinition> =
  T extends ItemTypeDefinition
    ? keyof T['fields'] extends never
      ? ItemDefinition<T['itemTypeId']>
      : ItemDefinition<
          T['itemTypeId'],
          {
            [K in keyof T['fields']]: T['fields'][K] extends FieldDefinition
              ? FieldDefinitionToFieldValue<T['fields'][K]>
              : never;
          }
        >
    : never;

export type ItemTypeDefinitionToItemDefinitionAsRequest<
  T extends ItemTypeDefinition,
> = T extends ItemTypeDefinition
  ? keyof T['fields'] extends never
    ? ItemDefinition<T['itemTypeId']>
    : ItemDefinition<
        T['itemTypeId'],
        Partial<{
          [K in keyof T['fields']]: T['fields'][K] extends FieldDefinition
            ? FieldDefinitionToFieldValueAsRequest<T['fields'][K]>
            : never;
        }>
      >
  : never;

export type ItemTypeDefinitionToItemDefinitionWithNestedBlocks<
  T extends ItemTypeDefinition,
> = T extends ItemTypeDefinition
  ? keyof T['fields'] extends never
    ? ItemDefinition<T['itemTypeId']>
    : ItemDefinition<
        T['itemTypeId'],
        {
          [K in keyof T['fields']]: T['fields'][K] extends FieldDefinition
            ? FieldDefinitionToFieldValueWithNestedBlocks<T['fields'][K]>
            : never;
        }
      >
  : never;

export type UnknownField = Record<string, unknown>;

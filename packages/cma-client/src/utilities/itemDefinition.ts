import type {
  BlockInNestedResponse,
  BlockInRequest,
  BooleanFieldValue,
  ColorFieldValue,
  DateFieldValue,
  DateTimeFieldValue,
  FileFieldValue,
  FileFieldValueInRequest,
  FloatFieldValue,
  GalleryFieldValue,
  GalleryFieldValueInRequest,
  IntegerFieldValue,
  JsonFieldValue,
  LatLonFieldValue,
  LinkFieldValue,
  LinksFieldValue,
  RichTextFieldValue,
  RichTextFieldValueInNestedResponse,
  RichTextFieldValueInRequest,
  SeoFieldValue,
  SingleBlockFieldValue,
  SingleBlockFieldValueInNestedResponse,
  SingleBlockFieldValueInRequest,
  SlugFieldValue,
  StringFieldValue,
  StructuredTextFieldValue,
  StructuredTextFieldValueInNestedResponse,
  StructuredTextFieldValueInRequest,
  TextFieldValue,
  VideoFieldValue,
} from '../fieldTypes';
import type {
  BooleanHrefFilter,
  ColorHrefFilter,
  DateHrefFilter,
  DateTimeHrefFilter,
  FileHrefFilter,
  FloatHrefFilter,
  GalleryHrefFilter,
  IntegerHrefFilter,
  ItemMetaFilter,
  ItemMetaOrderBy,
  JsonHrefFilter,
  LatLonHrefFilter,
  LinkHrefFilter,
  LinksHrefFilter,
  ParentIdFilter,
  PositionFilter,
  RichTextHrefFilter,
  SeoHrefFilter,
  SingleBlockHrefFilter,
  SlugHrefFilter,
  StringHrefFilter,
  StructuredTextHrefFilter,
  TextHrefFilter,
  VideoHrefFilter,
} from './itemInstancesHrefSchema';
import type { LocalizedFieldValue } from './normalizedFieldValues';

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
  blocks?: AllowedBlocks;
  inline_blocks?: AllowedInlineBlocks;
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
  Settings extends { locales: string } = { locales: string },
  ItemTypeId extends string = string,
  FieldDefinitions extends Record<string, FieldDefinition> = {},
> = {
  settings: Settings;
  itemTypeId: ItemTypeId;
  fields: FieldDefinitions;
};

/** Standard field values (response format) */
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

/** Request field values (request format with optional metadata) */
type FieldTypeToValueInRequest = {
  boolean: BooleanFieldValue;
  color: ColorFieldValue;
  date: DateFieldValue;
  date_time: DateTimeFieldValue;
  file: FileFieldValueInRequest;
  float: FloatFieldValue;
  gallery: GalleryFieldValueInRequest;
  integer: IntegerFieldValue;
  json: JsonFieldValue;
  lat_lon: LatLonFieldValue;
  link: LinkFieldValue;
  links: LinksFieldValue;
  rich_text: RichTextFieldValueInRequest;
  seo: SeoFieldValue;
  single_block: SingleBlockFieldValueInRequest;
  slug: SlugFieldValue;
  string: StringFieldValue;
  structured_text: StructuredTextFieldValueInRequest;
  text: TextFieldValue;
  video: VideoFieldValue;
  unknown: unknown;
};

type FieldTypeToHrefFilter = {
  boolean: BooleanHrefFilter;
  color: ColorHrefFilter;
  date: DateHrefFilter;
  date_time: DateTimeHrefFilter;
  file: FileHrefFilter;
  float: FloatHrefFilter;
  gallery: GalleryHrefFilter;
  integer: IntegerHrefFilter;
  json: JsonHrefFilter;
  lat_lon: LatLonHrefFilter;
  link: LinkHrefFilter;
  links: LinksHrefFilter;
  rich_text: RichTextHrefFilter;
  seo: SeoHrefFilter;
  single_block: SingleBlockHrefFilter;
  slug: SlugHrefFilter;
  string: StringHrefFilter;
  structured_text: StructuredTextHrefFilter;
  text: TextHrefFilter;
  video: VideoHrefFilter;
  unknown: unknown;
};

/** Localized wrapper */
type LocalizeIfNeeded<
  T extends FieldDefinition,
  Value,
  Locales extends string,
> = T extends { localized: true } ? LocalizedFieldValue<Value, Locales> : Value;

/** Standard mapping */
type FieldDefinitionToFieldValue<
  T extends FieldDefinition,
  Locales extends string,
> = LocalizeIfNeeded<T, FieldTypeToValue[T['type']], Locales>;

/** InRequest mapping (block fields become generic over allowed blocks) */
type FieldDefinitionToFieldValueInRequest<
  T extends FieldDefinition,
  Locales extends string,
> = T extends RichTextFieldDefinition<infer B>
  ? LocalizeIfNeeded<T, RichTextFieldValueInRequest<B>, Locales>
  : T extends SingleBlockFieldDefinition<infer B>
    ? LocalizeIfNeeded<T, SingleBlockFieldValueInRequest<B>, Locales>
    : T extends StructuredTextFieldDefinition<infer B, infer I>
      ? LocalizeIfNeeded<
          T,
          StructuredTextFieldValueInRequest<
            T extends { blocks: any } ? B : never,
            T extends { inline_blocks: any } ? I : never
          >,
          Locales
        >
      : LocalizeIfNeeded<T, FieldTypeToValueInRequest[T['type']], Locales>;

type FieldDefinitionToFieldValueInNestedResponse<
  T extends FieldDefinition,
  Locales extends string,
> = T extends RichTextFieldDefinition<infer B>
  ? LocalizeIfNeeded<T, RichTextFieldValueInNestedResponse<B>, Locales>
  : T extends SingleBlockFieldDefinition<infer B>
    ? LocalizeIfNeeded<T, SingleBlockFieldValueInNestedResponse<B>, Locales>
    : T extends StructuredTextFieldDefinition<infer B, infer I>
      ? LocalizeIfNeeded<
          T,
          StructuredTextFieldValueInNestedResponse<
            T extends { blocks: any } ? B : never,
            T extends { inline_blocks: any } ? I : never
          >,
          Locales
        >
      : LocalizeIfNeeded<T, FieldTypeToValue[T['type']], Locales>;

/** Transformers */
export type ToItemAttributes<T extends ItemTypeDefinition<any, any, any>> =
  T extends ItemTypeDefinition<infer Settings, infer ItemTypeId, infer Fields>
    ? keyof Fields extends never
      ? Record<string, unknown>
      : {
          [K in keyof Fields]: Fields[K] extends FieldDefinition
            ? FieldDefinitionToFieldValue<Fields[K], Settings['locales']>
            : never;
        }
    : never;

export type ToItemAttributesInRequest<
  T extends ItemTypeDefinition<any, any, any>,
> = T extends ItemTypeDefinition<infer Settings, infer ItemTypeId, infer Fields>
  ? keyof Fields extends never
    ? Record<string, unknown>
    : Partial<{
        [K in keyof Fields]: Fields[K] extends FieldDefinition
          ? FieldDefinitionToFieldValueInRequest<Fields[K], Settings['locales']>
          : never;
      }>
  : never;

export type ToItemAttributesInNestedResponse<
  T extends ItemTypeDefinition<any, any, any>,
> = T extends ItemTypeDefinition<infer Settings, infer ItemTypeId, infer Fields>
  ? keyof Fields extends never
    ? Record<string, unknown>
    : {
        [K in keyof Fields]: Fields[K] extends FieldDefinition
          ? FieldDefinitionToFieldValueInNestedResponse<
              Fields[K],
              Settings['locales']
            >
          : never;
      }
  : never;

export type ToItemHrefSchemaField<T extends ItemTypeDefinition<any, any, any>> =
  T extends ItemTypeDefinition<infer Settings, infer ItemTypeId, infer Fields>
    ? keyof Fields extends never
      ? Record<string, unknown>
      : ItemMetaFilter &
          Partial<{
            [K in keyof Fields]: K extends 'position'
              ? PositionFilter
              : K extends 'parent_id'
                ? ParentIdFilter
                : Fields[K] extends FieldDefinition
                  ? FieldTypeToHrefFilter[Fields[K]['type']]
                  : never;
          }>
    : never;

export type ToItemHrefSchemaOrderBy<
  T extends ItemTypeDefinition<any, any, any>,
> =
  | (T extends ItemTypeDefinition<
      infer Settings,
      infer ItemTypeId,
      infer Fields
    >
      ? keyof Fields extends never
        ? string
        : {
            [K in keyof Fields]: Fields[K] extends FieldDefinition
              ? Fields[K]['type'] extends
                  | 'boolean'
                  | 'date'
                  | 'date_time'
                  | 'float'
                  | 'integer'
                  | 'string'
                ? `${K & string}_ASC` | `${K & string}_DESC`
                : never
              : never;
          }[keyof Fields]
      : never)
  | ItemMetaOrderBy;

type NestedItemTypeDefinitions<
  T extends ItemTypeDefinition<any, any, any>,
  Seen extends string = never,
> = T extends ItemTypeDefinition<any, infer Id, infer Fields>
  ? Id extends Seen
    ? never // we already visited this item type -> stop recursing
    : {
        [K in keyof Fields]: Fields[K] extends RichTextFieldDefinition<infer B>
          ? B | NestedItemTypeDefinitions<B, Seen | Id>
          : Fields[K] extends SingleBlockFieldDefinition<infer B>
            ? B | NestedItemTypeDefinitions<B, Seen | Id>
            : Fields[K] extends StructuredTextFieldDefinition<infer B, infer I>
              ?
                  | B
                  | I
                  | NestedItemTypeDefinitions<B, Seen | Id>
                  | NestedItemTypeDefinitions<I, Seen | Id>
              : never;
      }[keyof Fields]
  : never;

export type ExtractNestedBlocksFromFieldValue<T> =
  T extends RichTextFieldValueInNestedResponse<infer D>
    ?
        | BlockInNestedResponse<D>
        | BlockInNestedResponse<NestedItemTypeDefinitions<D>>
    : T extends SingleBlockFieldValueInNestedResponse<infer D>
      ?
          | BlockInNestedResponse<D>
          | BlockInNestedResponse<NestedItemTypeDefinitions<D>>
      : T extends StructuredTextFieldValueInNestedResponse<infer DB, infer DI>
        ?
            | BlockInNestedResponse<DB>
            | BlockInNestedResponse<NestedItemTypeDefinitions<DB>>
            | BlockInNestedResponse<DI>
            | BlockInNestedResponse<NestedItemTypeDefinitions<DI>>
        : T extends StructuredTextFieldValueInNestedResponse<infer D>
          ?
              | BlockInNestedResponse<D>
              | BlockInNestedResponse<NestedItemTypeDefinitions<D>>
          : T extends RichTextFieldValueInRequest<infer D>
            ? BlockInRequest<D> | BlockInRequest<NestedItemTypeDefinitions<D>>
            : T extends SingleBlockFieldValueInRequest<infer D>
              ? BlockInRequest<D> | BlockInRequest<NestedItemTypeDefinitions<D>>
              : T extends StructuredTextFieldValueInRequest<infer DB, infer DI>
                ?
                    | BlockInRequest<DB>
                    | BlockInRequest<NestedItemTypeDefinitions<DB>>
                    | BlockInRequest<DI>
                    | BlockInRequest<NestedItemTypeDefinitions<DI>>
                : T extends StructuredTextFieldValueInRequest<infer D>
                  ?
                      | BlockInRequest<D>
                      | BlockInRequest<NestedItemTypeDefinitions<D>>
                  : never;

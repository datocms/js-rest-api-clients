import type {
  BooleanFieldAppearance,
  BooleanFieldValidators,
  BooleanFieldValue,
  ColorFieldAppearance,
  ColorFieldValidators,
  ColorFieldValue,
  DateFieldAppearance,
  DateFieldValidators,
  DateFieldValue,
  DateTimeFieldAppearance,
  DateTimeFieldValidators,
  DateTimeFieldValue,
  FileFieldAppearance,
  FileFieldValidators,
  FloatFieldAppearance,
  FloatFieldValidators,
  FloatFieldValue,
  GalleryFieldAppearance,
  GalleryFieldValidators,
  IntegerFieldAppearance,
  IntegerFieldValidators,
  IntegerFieldValue,
  JsonFieldAppearance,
  JsonFieldValidators,
  JsonFieldValue,
  LatLonFieldAppearance,
  LatLonFieldValidators,
  LatLonFieldValue,
  LinkFieldAppearance,
  LinkFieldValidators,
  LinksFieldAppearance,
  LinksFieldValidators,
  RichTextFieldAppearance,
  RichTextFieldValidators,
  SeoFieldAppearance,
  SeoFieldValidators,
  SingleBlockFieldAppearance,
  SingleBlockFieldValidators,
  SlugFieldAppearance,
  SlugFieldValidators,
  StringFieldAppearance,
  StringFieldValidators,
  StringFieldValue,
  StructuredTextFieldAppearance,
  StructuredTextFieldValidators,
  TextFieldAppearance,
  TextFieldValidators,
  TextFieldValue,
  VideoFieldAppearance,
  VideoFieldValidators,
} from '..';
import type { FieldAttributesStableShell } from '../generated/RawApiTypes';

/**
 * Enhanced appearance configuration with field-specific types and addon support
 */
type FieldAppearanceConfig<TAppearance> = TAppearance &
  Omit<FieldAttributesStableShell['appearance'], keyof TAppearance>;

/**
 * Base field configuration for attributes (non-localized), extending the original RawApiTypes
 */
type NonLocalizedFieldAttributesForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> = Omit<
  SourceType,
  'field_type' | 'default_value' | 'validators' | 'appearance' | 'localized'
> & {
  field_type: FieldType;
  localized: false;
  default_value: FieldValue;
  validators: FieldValidators;
  appearance: FieldAppearanceConfig<FieldAppearance>;
};

/**
 * Base field configuration for attributes (localized), extending the original RawApiTypes
 */
type LocalizedFieldAttributesForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> = Omit<
  SourceType,
  'field_type' | 'default_value' | 'validators' | 'appearance' | 'localized'
> & {
  field_type: FieldType;
  localized: true;
  default_value: Record<string, FieldValue>;
  validators: FieldValidators;
  appearance: FieldAppearanceConfig<FieldAppearance>;
};

/**
 * Union of localized and non-localized field configurations for attributes
 */
type FieldAttributesForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> =
  | NonLocalizedFieldAttributesForFieldType<
      SourceType,
      FieldType,
      FieldValue,
      FieldValidators,
      FieldAppearance
    >
  | LocalizedFieldAttributesForFieldType<
      SourceType,
      FieldType,
      FieldValue,
      FieldValidators,
      FieldAppearance
    >;

export type GenericFieldAttributes<SourceType> =
  | FieldAttributesForFieldType<
      SourceType,
      'boolean',
      BooleanFieldValue,
      BooleanFieldValidators,
      BooleanFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'color',
      ColorFieldValue,
      ColorFieldValidators,
      ColorFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'date',
      DateFieldValue,
      DateFieldValidators,
      DateFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'date_time',
      DateTimeFieldValue,
      DateTimeFieldValidators,
      DateTimeFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'file',
      // this field type does not support default values
      null,
      FileFieldValidators,
      FileFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'float',
      FloatFieldValue,
      FloatFieldValidators,
      FloatFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'gallery',
      // this field type does not support default values
      null,
      GalleryFieldValidators,
      GalleryFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'integer',
      IntegerFieldValue,
      IntegerFieldValidators,
      IntegerFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'json',
      JsonFieldValue,
      JsonFieldValidators,
      JsonFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'lat_lon',
      LatLonFieldValue,
      LatLonFieldValidators,
      LatLonFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'link',
      // this field type does not support default values
      null,
      LinkFieldValidators,
      LinkFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'links',
      // this field type does not support default values
      null,
      LinksFieldValidators,
      LinksFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'rich_text',
      // this field type does not support default values
      null,
      RichTextFieldValidators,
      RichTextFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'seo',
      // this field type does not support default values
      null,
      SeoFieldValidators,
      SeoFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'single_block',
      // this field type does not support default values
      null,
      SingleBlockFieldValidators,
      SingleBlockFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'slug',
      // this field type does not support default values
      null,
      SlugFieldValidators,
      SlugFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'string',
      StringFieldValue,
      StringFieldValidators,
      StringFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'structured_text',
      // this field type does not support default values
      null,
      StructuredTextFieldValidators,
      StructuredTextFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'text',
      TextFieldValue,
      TextFieldValidators,
      TextFieldAppearance
    >
  | FieldAttributesForFieldType<
      SourceType,
      'video',
      // this field type does not support default values
      null,
      VideoFieldValidators,
      VideoFieldAppearance
    >;

type LocalizedFieldCreateConfigForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> = Omit<
  SourceType,
  'field_type' | 'default_value' | 'validators' | 'appearance' | 'localized'
> & {
  field_type: FieldType;
  localized: true;
  default_value?: Record<string, FieldValue>;
  validators?: FieldValidators;
  appearance?: FieldAppearanceConfig<FieldAppearance>;
};

type NonLocalizedFieldCreateConfigForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> = Omit<
  SourceType,
  'field_type' | 'default_value' | 'validators' | 'appearance' | 'localized'
> & {
  field_type: FieldType;
  localized?: false;
  default_value?: FieldValue;
  validators?: FieldValidators;
  appearance?: FieldAppearanceConfig<FieldAppearance>;
};

type FieldCreateConfigForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> =
  | LocalizedFieldCreateConfigForFieldType<
      SourceType,
      FieldType,
      FieldValue,
      FieldValidators,
      FieldAppearance
    >
  | NonLocalizedFieldCreateConfigForFieldType<
      SourceType,
      FieldType,
      FieldValue,
      FieldValidators,
      FieldAppearance
    >;

export type FieldCreateConfig<SourceType> =
  | FieldCreateConfigForFieldType<
      SourceType,
      'boolean',
      BooleanFieldValue,
      BooleanFieldValidators,
      BooleanFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'color',
      ColorFieldValue,
      ColorFieldValidators,
      ColorFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'date',
      DateFieldValue,
      DateFieldValidators,
      DateFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'date_time',
      DateTimeFieldValue,
      DateTimeFieldValidators,
      DateTimeFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'file',
      // this field type does not support default values
      null,
      FileFieldValidators,
      FileFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'float',
      FloatFieldValue,
      FloatFieldValidators,
      FloatFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'gallery',
      // this field type does not support default values
      null,
      GalleryFieldValidators,
      GalleryFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'integer',
      IntegerFieldValue,
      IntegerFieldValidators,
      IntegerFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'json',
      JsonFieldValue,
      JsonFieldValidators,
      JsonFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'lat_lon',
      LatLonFieldValue,
      LatLonFieldValidators,
      LatLonFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'link',
      // this field type does not support default values
      null,
      LinkFieldValidators,
      LinkFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'links',
      // this field type does not support default values
      null,
      LinksFieldValidators,
      LinksFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'rich_text',
      // this field type does not support default values
      null,
      RichTextFieldValidators,
      RichTextFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'seo',
      // this field type does not support default values
      null,
      SeoFieldValidators,
      SeoFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'single_block',
      // this field type does not support default values
      null,
      SingleBlockFieldValidators,
      SingleBlockFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'slug',
      // this field type does not support default values
      null,
      SlugFieldValidators,
      SlugFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'string',
      StringFieldValue,
      StringFieldValidators,
      StringFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'structured_text',
      // this field type does not support default values
      null,
      StructuredTextFieldValidators,
      StructuredTextFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'text',
      TextFieldValue,
      TextFieldValidators,
      TextFieldAppearance
    >
  | FieldCreateConfigForFieldType<
      SourceType,
      'video',
      // this field type does not support default values
      null,
      VideoFieldValidators,
      VideoFieldAppearance
    >;

/**
 * Helper type to conditionally handle default values based on localization for field updates
 */
type FieldUpdateDefaultValue<T> = T | Record<string, T> | undefined;

type FieldUpdateConfigForFieldType<
  SourceType,
  FieldType extends FieldAttributesStableShell['field_type'],
  FieldValue,
  FieldValidators,
  FieldAppearance,
> = Omit<
  SourceType,
  'field_type' | 'default_value' | 'validators' | 'appearance'
> & {
  field_type?: FieldType;
  default_value?: FieldUpdateDefaultValue<FieldValue>;
  validators?: FieldValidators;
  appearance?: FieldAppearanceConfig<FieldAppearance>;
};

export type FieldUpdateConfig<SourceType> =
  | FieldUpdateConfigForFieldType<
      SourceType,
      'boolean',
      BooleanFieldValue,
      BooleanFieldValidators,
      BooleanFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'color',
      ColorFieldValue,
      ColorFieldValidators,
      ColorFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'date',
      DateFieldValue,
      DateFieldValidators,
      DateFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'date_time',
      DateTimeFieldValue,
      DateTimeFieldValidators,
      DateTimeFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'file',
      // this field type does not support default values
      null,
      FileFieldValidators,
      FileFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'float',
      FloatFieldValue,
      FloatFieldValidators,
      FloatFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'gallery',
      // this field type does not support default values
      null,
      GalleryFieldValidators,
      GalleryFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'integer',
      IntegerFieldValue,
      IntegerFieldValidators,
      IntegerFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'json',
      JsonFieldValue,
      JsonFieldValidators,
      JsonFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'lat_lon',
      LatLonFieldValue,
      LatLonFieldValidators,
      LatLonFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'link',
      // this field type does not support default values
      null,
      LinkFieldValidators,
      LinkFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'links',
      // this field type does not support default values
      null,
      LinksFieldValidators,
      LinksFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'rich_text',
      // this field type does not support default values
      null,
      RichTextFieldValidators,
      RichTextFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'seo',
      // this field type does not support default values
      null,
      SeoFieldValidators,
      SeoFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'single_block',
      // this field type does not support default values
      null,
      SingleBlockFieldValidators,
      SingleBlockFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'slug',
      // this field type does not support default values
      null,
      SlugFieldValidators,
      SlugFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'string',
      StringFieldValue,
      StringFieldValidators,
      StringFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'structured_text',
      // this field type does not support default values
      null,
      StructuredTextFieldValidators,
      StructuredTextFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'text',
      TextFieldValue,
      TextFieldValidators,
      TextFieldAppearance
    >
  | FieldUpdateConfigForFieldType<
      SourceType,
      'video',
      // this field type does not support default values
      null,
      VideoFieldValidators,
      VideoFieldAppearance
    >;

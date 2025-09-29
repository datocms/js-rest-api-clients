// String matching filter for text-based filters
export type StringMatchesFilter = {
  /** Pattern to match against */
  pattern: string;
  /** Whether the match should be case sensitive */
  case_sensitive?: boolean;
  /** Whether to treat the pattern as a regular expression */
  regexp?: boolean;
};

// Near filter for latitude/longitude fields
export type LatLonNearFilter = {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Radius in meters */
  radius: number;
};

// HrefFilter types for all field types
export type BooleanHrefFilter = {
  /** Search for records with an exact match */
  eq?: boolean;
};

export type IntegerHrefFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: number;
  /** Filter records with a value that's less than the one specified */
  lt?: number;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: number;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: number;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
  /** Search for records with an exact match */
  eq?: number;
  /** Exclude records with an exact match */
  neq?: number;
};

export type FloatHrefFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: number;
  /** Filter records with a value that's less than the one specified */
  lt?: number;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: number;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: number;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
  /** Search for records with an exact match */
  eq?: number;
  /** Exclude records with an exact match */
  neq?: number;
};

export type DateHrefFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: string;
  /** Filter records with a value that's less than the one specified */
  lt?: string;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: string;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: string;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
  /** Search for records with an exact match */
  eq?: string;
  /** Exclude records with an exact match */
  neq?: string;
};

export type ColorHrefFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type StringHrefFilter = {
  /** Filter records based on a regular expression */
  matches?: StringMatchesFilter;
  /** Exclude records based on a regular expression */
  not_matches?: StringMatchesFilter;
  /** Filter records with the specified field set as blank (null or empty string) */
  is_blank?: boolean;
  /** Filter records with the specified field present (neither null, nor empty string) */
  is_present?: boolean;
  /** Search for records with an exact match */
  eq?: string;
  /** Exclude records with an exact match */
  neq?: string;
  /** Filter records that equal one of the specified values */
  in?: string[];
  /** Filter records that do not equal one of the specified values */
  not_in?: string[];
  /** @deprecated Use is_present instead. Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type DateTimeHrefFilter = {
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt?: string;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt?: string;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte?: string;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte?: string;
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq?: string;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq?: string;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type JsonHrefFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type LatLonHrefFilter = {
  /** Filter records within the specified radius in meters */
  near?: LatLonNearFilter;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type SlugHrefFilter = {
  /** Search for records with an exact match */
  eq?: string;
  /** Exclude records with an exact match */
  neq?: string;
  /** Filter records that have one of the specified slugs */
  in?: string[];
  /** Filter records that do not have one of the specified slugs */
  not_in?: string[];
};

export type VideoHrefFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type SeoHrefFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type FileHrefFilter = {
  /** Search for records with an exact match. The specified value must be an Upload ID */
  eq?: string;
  /** Exclude records with an exact match. The specified value must be an Upload ID */
  neq?: string;
  /** Filter records that have one of the specified uploads */
  in?: string[];
  /** Filter records that do not have one of the specified uploads */
  not_in?: string[];
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type GalleryHrefFilter = {
  /** Search for records with an exact match. The specified values must be Upload IDs */
  eq?: string[];
  /** Filter records that have all of the specified uploads. The specified values must be Upload IDs */
  all_in?: string[];
  /** Filter records that have one of the specified uploads. The specified values must be Upload IDs */
  any_in?: string[];
  /** Filter records that do not have any of the specified uploads. The specified values must be Upload IDs */
  not_in?: string[];
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type LinkHrefFilter = {
  /** Search for records with an exact match. The specified value must be a Record ID */
  eq?: string;
  /** Exclude records with an exact match. The specified value must be a Record ID */
  neq?: string;
  /** Filter records linked to one of the specified records */
  in?: string[];
  /** Filter records not linked to one of the specified records */
  not_in?: string[];
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type LinksHrefFilter = {
  /** Search for records with an exact match. The specified values must be Record IDs */
  eq?: string[];
  /** Filter records linked to all of the specified records. The specified values must be Record IDs */
  all_in?: string[];
  /** Filter records linked to at least one of the specified records. The specified values must be Record IDs */
  any_in?: string[];
  /** Filter records not linked to any of the specified records. The specified values must be Record IDs */
  not_in?: string[];
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

export type RichTextHrefFilter = Record<string, never>;

export type StructuredTextHrefFilter = {
  /** Filter records based on a regular expression */
  matches?: StringMatchesFilter;
  /** Exclude records based on a regular expression */
  not_matches?: StringMatchesFilter;
};

export type SingleBlockHrefFilter = Record<string, never>;

export type TextHrefFilter = {
  /** Filter records based on a regular expression */
  matches?: StringMatchesFilter;
  /** Exclude records based on a regular expression */
  not_matches?: StringMatchesFilter;
  /** Filter records with the specified field set as blank (null or empty string) */
  is_blank?: boolean;
  /** Filter records with the specified field present (neither null, nor empty string) */
  is_present?: boolean;
  /** @deprecated Use is_present instead. Filter records with the specified field defined (i.e. with any value) or not */
  exists?: boolean;
};

// Status filter for item status
export type StatusFilter = {
  /** Search the record with the specified status */
  eq?: 'draft' | 'updated' | 'published';
  /** Exclude the record with the specified status */
  neq?: 'draft' | 'updated' | 'published';
  /** Search records with the specified statuses */
  in?: ('draft' | 'updated' | 'published')[];
  /** Search records without the specified statuses */
  notIn?: ('draft' | 'updated' | 'published')[];
};

// ID filter for item IDs
export type ItemIdFilter = {
  /** Search the record with the specified ID */
  eq?: string;
  /** Exclude the record with the specified ID */
  neq?: string;
  /** Search records with the specified IDs */
  in?: string[];
  /** Search records that do not have the specified IDs */
  notIn?: string[];
};

// Parent filter for tree-like collections
export type ParentIdFilter = {
  /** Filter records children of the specified record. Value must be a Record ID */
  eq?: string;
  /** Filter records with a parent record or not */
  exists?: boolean;
};

// Position filter for sorted and tree-like collections
export type PositionFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: number;
  /** Filter records with a value that's less than the one specified */
  lt?: number;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: number;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: number;
  /** Search for records with an exact match */
  eq?: number;
  /** Exclude records with an exact match */
  neq?: number;
};

export type ItemMetaFilter = {
  _created_at?: DateTimeHrefFilter;
  _first_published_at?: DateTimeHrefFilter;
  _is_valid?: BooleanHrefFilter;
  _publication_scheduled_at?: DateTimeHrefFilter;
  _published_at?: DateTimeHrefFilter;
  _status?: StatusFilter;
  _unpublishing_scheduled_at?: DateTimeHrefFilter;
  _updated_at?: DateTimeHrefFilter;
  id?: ItemIdFilter;
};

export type ItemMetaOrderBy =
  | '_created_at_ASC'
  | '_created_at_DESC'
  | 'id_ASC'
  | 'id_DESC'
  | '_first_published_at_ASC'
  | '_first_published_at_DESC'
  | '_publication_scheduled_at_ASC'
  | '_publication_scheduled_at_DESC'
  | '_unpublishing_scheduled_at_ASC'
  | '_unpublishing_scheduled_at_DESC'
  | '_published_at_ASC'
  | '_published_at_DESC'
  | '_status_ASC'
  | '_status_DESC'
  | '_updated_at_ASC'
  | '_updated_at_DESC'
  | '_is_valid_ASC'
  | '_is_valid_DESC'
  | '_rank_ASC'
  | '_rank_DESC';

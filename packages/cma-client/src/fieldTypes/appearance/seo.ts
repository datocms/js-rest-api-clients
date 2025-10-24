/**
 * Built-in editor for SEO fields.
 */
export type SeoEditorConfiguration = {
  /** Specify which fields of the SEO input should be visible to editors */
  fields: Array<
    'title' | 'description' | 'image' | 'no_index' | 'twitter_card'
  >;
  /** Specify which previews should be visible to editors */
  previews: Array<
    | 'google'
    | 'twitter'
    | 'slack'
    | 'whatsapp'
    | 'telegram'
    | 'facebook'
    | 'linkedin'
  >;
};

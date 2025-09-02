/**
 * Built-in editor for Structured text fields.
 */
export type StructuredTextEditorConfiguration = {
  /** Specify which nodes the field should allow */
  nodes: Array<
    'blockquote' | 'code' | 'heading' | 'link' | 'list' | 'thematicBreak'
  >;
  /** Specify which marks the field should allow */
  marks: Array<
    'strong' | 'emphasis' | 'underline' | 'strikethrough' | 'code' | 'highlight'
  >;
  /** If nodes includes "heading", specify which heading levels the field should allow (numbers between 1 and 6) */
  heading_levels: Array<1 | 2 | 3 | 4 | 5 | 6>;
  /** Whether you want block nodes collapsed by default or not */
  blocks_start_collapsed?: boolean;
  /** Whether you want to show the "Open this link in a new tab?" checkbox, that fills in the target: "_blank" meta attribute for links */
  show_links_target_blank?: boolean;
  /** Whether you want to show the complete meta editor for links */
  show_links_meta_editor?: boolean;
};

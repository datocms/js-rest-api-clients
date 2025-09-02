/**
 * Markdown editor for Multiple-paragraph text fields.
 */
export type MarkdownEditorConfiguration = {
  /** Specify which buttons the toolbar should have */
  toolbar: Array<
    | 'heading'
    | 'bold'
    | 'italic'
    | 'strikethrough'
    | 'code'
    | 'unordered_list'
    | 'ordered_list'
    | 'quote'
    | 'link'
    | 'image'
    | 'fullscreen'
  >;
};

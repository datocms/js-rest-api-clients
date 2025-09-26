/**
 * HTML editor for Multiple-paragraph text fields.
 */
export type WysiwygEditorConfiguration = {
  /** Specify which buttons the toolbar should have */
  toolbar: Array<
    | 'format'
    | 'bold'
    | 'italic'
    | 'strikethrough'
    | 'code'
    | 'ordered_list'
    | 'unordered_list'
    | 'quote'
    | 'table'
    | 'link'
    | 'image'
    | 'show_source'
    | 'undo'
    | 'redo'
    | 'align_left'
    | 'align_center'
    | 'align_right'
    | 'align_justify'
    | 'outdent'
    | 'indent'
    | 'fullscreen'
  >;
};

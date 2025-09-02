/**
 * Built-in editor for Color fields.
 */
export type ColorPickerEditorConfiguration = {
  /** Should the color picker allow to specify the alpha value? */
  enable_alpha: boolean;
  /** List of preset colors to offer to the user (hex color strings) */
  preset_colors: Array<string>;
};

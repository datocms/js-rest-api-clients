/**
 * Only accept references to block records of the specified block models.
 */
export type SingleBlockBlocksValidator = {
  /** Set of allowed Block Model IDs */
  item_types: string[];
};

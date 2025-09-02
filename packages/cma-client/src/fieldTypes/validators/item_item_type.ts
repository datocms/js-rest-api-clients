/**
 * Only accept references to records of the specified models.
 */
export type ItemItemTypeValidator = {
  /** Set of allowed model IDs */
  item_types: string[];
  /**
   * Strategy to apply when a publishing is requested and this field references some unpublished records.
   * - "fail": Fail the operation and notify the user
   * - "publish_references": Publish also the referenced records
   * @default "fail"
   */
  on_publish_with_unpublished_references_strategy?:
    | 'fail'
    | 'publish_references';
  /**
   * Strategy to apply when unpublishing is requested for a record referenced by this field.
   * - "fail": Fail the operation and notify the user
   * - "unpublish": Unpublish also this record
   * - "delete_references": Try to remove the reference to the unpublished record (if the field has a required validation it will fail)
   * @default "fail"
   */
  on_reference_unpublish_strategy?: 'fail' | 'unpublish' | 'delete_references';
  /**
   * Strategy to apply when deletion is requested for a record referenced by this field.
   * - "fail": Fail the operation and notify the user
   * - "delete_references": Try to remove the reference to the deleted record (if the field has a required validation it will fail)
   * @default "delete_references"
   */
  on_reference_delete_strategy?: 'fail' | 'delete_references';
};

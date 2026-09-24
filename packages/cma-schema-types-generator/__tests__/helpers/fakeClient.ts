type ItemTypeOpts = {
  id: string;
  api_key: string;
  modular_block?: boolean;
  sortable?: boolean;
  tree?: boolean;
};

type FieldOpts = {
  id: string;
  api_key: string;
  field_type: string;
  item_type_id: string;
  localized?: boolean;
  position?: number;
  validators?: Record<string, unknown>;
};

export function itemType(opts: ItemTypeOpts) {
  return {
    type: 'item_type',
    id: opts.id,
    attributes: {
      api_key: opts.api_key,
      modular_block: opts.modular_block ?? false,
      sortable: opts.sortable ?? false,
      tree: opts.tree ?? false,
    },
  };
}

export function field(opts: FieldOpts) {
  return {
    type: 'field',
    id: opts.id,
    attributes: {
      api_key: opts.api_key,
      field_type: opts.field_type,
      localized: opts.localized ?? false,
      position: opts.position ?? 0,
      validators: opts.validators ?? {},
    },
    relationships: {
      item_type: { data: { id: opts.item_type_id, type: 'item_type' } },
    },
  };
}

/**
 * Keeps only the attributes and the relationships that the sparse fieldset
 * names, as the API does. If the fieldset does not name an entity type, the
 * entity stays as it is.
 */
function applyFieldset(
  entity: {
    type: string;
    attributes: Record<string, unknown>;
    relationships?: Record<string, unknown>;
  },
  fields: Record<string, string> | undefined,
) {
  const fieldset = fields?.[entity.type];

  if (fieldset === undefined) {
    return entity;
  }

  const names = fieldset.split(',');
  const pick = (object: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(object).filter(([name]) => names.includes(name)),
    );

  return {
    ...entity,
    attributes: pick(entity.attributes),
    ...(entity.relationships
      ? { relationships: pick(entity.relationships) }
      : {}),
  };
}

export function fakeClient(opts: {
  locales: string[];
  itemTypes: ReturnType<typeof itemType>[];
  fields: ReturnType<typeof field>[];
}) {
  return {
    site: {
      rawFind: async (params: {
        include: string;
        fields?: Record<string, string>;
      }): Promise<any> => ({
        data: applyFieldset(
          { type: 'site', attributes: { locales: opts.locales } },
          params.fields,
        ),
        included: [...opts.itemTypes, ...opts.fields].map((entity) =>
          applyFieldset(entity, params.fields),
        ),
      }),
    },
  } as any;
}

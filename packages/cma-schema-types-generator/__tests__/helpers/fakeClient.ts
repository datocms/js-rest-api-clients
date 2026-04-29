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
      validators: opts.validators ?? {},
    },
    relationships: {
      item_type: { data: { id: opts.item_type_id, type: 'item_type' } },
    },
  };
}

export function fakeClient(opts: {
  locales: string[];
  itemTypes: ReturnType<typeof itemType>[];
  fields: ReturnType<typeof field>[];
}) {
  return {
    site: {
      // biome-ignore lint/suspicious/noExplicitAny: test fake matches structural shape only
      rawFind: async (_params: { include: string }): Promise<any> => ({
        data: {
          attributes: { locales: opts.locales },
        },
        included: [...opts.itemTypes, ...opts.fields],
      }),
    },
    // biome-ignore lint/suspicious/noExplicitAny: cast for structural compatibility
  } as any;
}

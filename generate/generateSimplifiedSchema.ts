function simplifySchema(
  objectSchema: any,
  dropIdRequired: boolean,
  shouldDropAttributesProperties = false,
) {
  const { attributes, relationships, meta, id, type } =
    objectSchema.properties as any;

  return {
    ...objectSchema,
    additionalProperties: shouldDropAttributesProperties
      ? false
      : Boolean(attributes && !attributes.properties),
    required: [
      ...(objectSchema.required?.includes('id') && !dropIdRequired
        ? ['id']
        : []),
      ...(objectSchema.required?.includes('attributes')
        ? attributes?.required || []
        : []),
      ...(objectSchema.required?.includes('relationships')
        ? relationships?.required || []
        : []),
      ...(objectSchema.required?.includes('meta') ? ['meta'] : []),
      ...(!attributes && !relationships && !meta
        ? objectSchema.required.filter((attr: string) => attr !== 'type')
        : []),
    ],
    properties: {
      ...(id ? { id } : {}),
      ...(type ? { type } : {}),
      ...(shouldDropAttributesProperties ? {} : attributes?.properties || {}),
      ...(relationships?.properties
        ? Object.fromEntries(
            Object.entries<any>(relationships.properties).map(
              ([relName, relSchema]) => {
                if ('$ref' in relSchema) {
                  return [relName, relSchema];
                }

                if (!relSchema.properties.data) {
                  return [relName, relSchema];
                }

                return [relName, relSchema.properties.data];
              },
            ),
          )
        : {}),
      ...(meta ? { meta } : {}),
    },
  };
}

function simplifyEntity(objectSchema: any) {
  const { attributes, relationships } = objectSchema.definitions;
  const { id, type, meta } = objectSchema.properties;

  objectSchema.required = [
    'id',
    'type',
    ...(objectSchema.required?.includes('attributes')
      ? objectSchema.definitions.attributes?.required || []
      : []),
    ...(objectSchema.required?.includes('relationships')
      ? objectSchema.definitions.relationships?.required || []
      : []),
    ...(objectSchema.required?.includes('meta') ? ['meta'] : []),
  ];

  objectSchema.properties = {
    ...(id ? { id } : {}),
    ...(type ? { type } : {}),
    ...(attributes?.properties
      ? Object.fromEntries(
          Object.keys(attributes.properties).map((key) => [
            key,
            {
              $ref: `${objectSchema.properties.attributes.$ref}/properties/${key}`,
            },
          ]),
        )
      : {}),
    ...(relationships?.properties
      ? Object.fromEntries(
          Object.keys(relationships.properties).map((key) => [
            key,
            {
              $ref: `${objectSchema.properties.relationships.$ref}/properties/${key}`,
            },
          ]),
        )
      : {}),
    ...(meta ? { meta } : {}),
  };

  if (attributes && !attributes.properties) {
    objectSchema.additionalProperties = true;
  }
}

function simplifyEntityRelationships(schema: any) {
  if (schema.properties) {
    simplifyEntity(schema);
  }

  if (schema.definitions.relationships) {
    for (const rel of Object.keys(
      schema.definitions.relationships.properties,
    )) {
      schema.definitions.relationships.properties[rel] =
        schema.definitions.relationships.properties[rel].properties.data;
    }
  }
}

function applyToInnerObject(
  name: string,
  schema: any,
  apply: (
    schema: any,
    dropIdRequired: boolean,
    shouldDropAttributesProperties?: boolean,
  ) => any,
  shouldDropAttributesProperties = false,
) {
  if (!schema) {
    return schema;
  }

  if (schema.$ref) {
    return schema;
  }

  if (schema.type === 'object') {
    return apply(schema, true, shouldDropAttributesProperties);
  }

  if (schema.anyOf) {
    schema.anyOf = schema.anyOf.map((i: any) =>
      applyToInnerObject(name, i, apply, shouldDropAttributesProperties),
    );
    return schema;
  }

  if (schema.type === 'array') {
    if (schema.items && Array.isArray(schema.items)) {
      schema.items = schema.items.map((i: any) =>
        applyToInnerObject(
          name,
          i,
          (x, dropId, shouldDrop) => apply(x, false, shouldDrop),
          shouldDropAttributesProperties,
        ),
      );
    } else if (schema.items) {
      schema.items = applyToInnerObject(
        name,
        schema.items,
        (x, dropId, shouldDrop) => apply(x, false, shouldDrop),
        shouldDropAttributesProperties,
      );
    }

    return schema;
  }

  throw new Error(`Problem with ${name}: ${JSON.stringify(schema, null, 2)}!`);
}

function simplifyTargetSchema(schema: any) {
  return schema;
}

export default function simplifyLinks(schema: any) {
  for (const [jsonApiType, subschema] of Object.entries<any>(
    schema.definitions,
  )) {
    simplifyEntityRelationships(subschema);

    if (jsonApiType === 'item') {
      subschema.additionalProperties = false;
    }

    if (subschema.links) {
      for (const link of subschema.links) {
        const originalSchema = link.schema;

        const shouldDropAttributesProperties =
          jsonApiType === 'item' &&
          [
            'instances',
            'self',
            'create',
            'update',
            'validate_new',
            'validate_existing',
            'duplicate',
          ].includes(link.rel);

        link.schema = applyToInnerObject(
          `${jsonApiType} ${link.rel} schema`,
          originalSchema?.properties?.data,
          simplifySchema,
          shouldDropAttributesProperties,
        );

        if (originalSchema?.type.includes('null')) {
          if (link.schema?.type === 'object') {
            link.schema.type = ['object', 'null'];
          } else {
            throw new Error(
              `Problem with ${jsonApiType} ${link.rel} schema: ${JSON.stringify(
                originalSchema,
                null,
                2,
              )}!`,
            );
          }
        }

        link.targetSchema = simplifyTargetSchema(
          link.targetSchema?.properties?.data,
        );
        link.jobSchema = simplifyTargetSchema(link.jobSchema?.properties?.data);
      }
    }
  }
}

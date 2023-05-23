import JsonRefParser from '@apidevtools/json-schema-ref-parser';

function simplifySchema(objectSchema: any) {
  const { attributes, relationships, meta, id, type } =
    objectSchema.properties as any;

  return {
    ...objectSchema,
    additionalProperties: attributes && !attributes.properties,
    required: [
      ...(objectSchema.required?.includes('attributes')
        ? attributes?.required || []
        : []),
      ...(objectSchema.required?.includes('relationships')
        ? relationships?.required || []
        : []),
      ...(objectSchema.required?.includes('meta') ? ['meta'] : []),
    ],
    properties: {
      ...(id ? { id } : {}),
      ...(type ? { type } : {}),
      ...(attributes?.properties || {}),
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
      ? Object.keys(attributes.properties).reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              $ref: `${objectSchema.properties.attributes.$ref}/properties/${key}`,
            },
          }),
          {},
        )
      : {}),
    ...(relationships?.properties
      ? Object.keys(relationships.properties).reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              $ref: `${objectSchema.properties.relationships.$ref}/properties/${key}`,
            },
          }),
          {},
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
    Object.entries(schema.definitions.relationships.properties).forEach(
      ([rel, relSchema]) => {
        schema.definitions.relationships.properties[rel] =
          schema.definitions.relationships.properties[rel].properties.data;
      },
    );
  }
}

function applyToInnerObject(
  name: string,
  schema: any,
  apply: (schema: any) => any,
) {
  if (!schema) {
    return schema;
  }

  if (schema.$ref) {
    return schema;
  }

  if (schema.type === 'object') {
    return apply(schema);
  }

  if (schema.anyOf) {
    schema.anyOf = schema.anyOf.map((i: any) =>
      applyToInnerObject(name, i, apply),
    );
    return schema;
  }

  if (schema.type === 'array') {
    if (schema.items && Array.isArray(schema.items)) {
      schema.items = schema.items.map((i: any) =>
        applyToInnerObject(name, i, apply),
      );
    } else if (schema.items) {
      schema.items = applyToInnerObject(name, schema.items, apply);
    }

    return schema;
  }

  throw new Error(`Problem with ${name}: ${JSON.stringify(schema, null, 2)}!`);
}

function simplifyTargetSchema(schema: any) {
  return schema;
}

export default function simplifyLinks(schema: any) {
  Object.entries<any>(schema.definitions).forEach(([jsonApiType, schema]) => {
    simplifyEntityRelationships(schema);
    if (schema.links) {
      schema.links.forEach((link: any) => {
        const originalSchema = link.schema;

        link.schema = applyToInnerObject(
          `${jsonApiType} ${link.rel} schema`,
          originalSchema?.properties?.data,
          simplifySchema,
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
      });
    }
  });
}

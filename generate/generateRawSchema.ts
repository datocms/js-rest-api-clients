function dropAttributesProperties(schema: any) {
  if (schema.type === 'array') {
    dropAttributesProperties(schema.items);
  }

  if (schema.type === 'object') {
    if (Array.isArray(schema.required)) {
      schema.required = schema.required.filter(
        (el: string) => el !== 'attributes',
      );
      delete schema.properties.attributes;
    }
  }
}

export default function generateRawSchema(schema: any) {
  for (const [jsonApiType, subschema] of Object.entries<any>(
    schema.definitions,
  )) {
    if (subschema.links) {
      for (const link of subschema.links) {
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

        if (shouldDropAttributesProperties) {
          dropAttributesProperties(subschema);

          if (link.schema) {
            dropAttributesProperties(link.schema.properties.data);
          }

          if (link.targetSchema) {
            dropAttributesProperties(link.targetSchema.properties.data);
          }

          if (link.jobSchema) {
            dropAttributesProperties(link.jobSchema.properties.data);
          }
        }
      }
    }
  }
}

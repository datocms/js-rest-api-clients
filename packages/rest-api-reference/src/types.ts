import type { JSONSchema4Type, JSONSchema4TypeName } from 'json-schema';

// ---------------------------------------------------------------------------
// JSON Schema (subset used by hyperschemas)
// ---------------------------------------------------------------------------

export interface JSONSchema {
  id?: string;
  $ref?: string;
  $schema?: string;
  title?: string;
  description?: string;
  default?: JSONSchema4Type;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | JSONSchema;
  items?: JSONSchema | JSONSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: boolean | string[];
  additionalProperties?: boolean | JSONSchema;
  definitions?: Record<string, JSONSchema>;
  properties?: Record<string, JSONSchema>;
  patternProperties?: Record<string, JSONSchema>;
  dependencies?: Record<string, JSONSchema | string[]>;
  enum?: JSONSchema4Type[];
  enumDescription?: Record<string, string>;
  type?: JSONSchema4TypeName | JSONSchema4TypeName[];
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
  extends?: string | string[];
  format?: string;
  const?: JSONSchema4Type;
  hideFromDocs?: boolean;
  deprecated?: string;
  hideFromExample?: boolean;
  example?: unknown;
  examples?: unknown[];
}

// ---------------------------------------------------------------------------
// Hyperschema types (describing a REST API entity and its actions/links)
// ---------------------------------------------------------------------------

export type HyperschemaLinkHttpExample = {
  id: string;
  title: string;
  description: string;
  request?: {
    description?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url?: string;
    headers?: Record<string, string>;
    body?: string;
  };
  response?: {
    description?: string;
    statusCode?: number;
    statusText?: string;
    headers?: Record<string, string>;
    body?: string;
  };
};

export type HyperschemaLinkJsExample = {
  id: string;
  title: string;
  description: string;
  request?: {
    description?: string;
    code?: string;
  };
  response?: {
    description?: string;
    code?: string;
  };
};

export type HyperschemaLink = {
  private?: boolean;
  rel: string;
  title: string;
  description?: string;
  documentation?: {
    javascript?: {
      description?: string;
      examples: HyperschemaLinkJsExample[];
    };
    http?: {
      description?: string;
      examples: HyperschemaLinkHttpExample[];
    };
  };
  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schema?: JSONSchema;
  targetSchema?: JSONSchema;
  hrefSchema?: JSONSchema;
  jobSchema?: JSONSchema;
};

export type HyperschemaEntity = JSONSchema & {
  links?: HyperschemaLink[];
};

export type Hyperschema = JSONSchema & {
  groups: Array<{
    title: string;
    resources: string[];
  }>;
};

// ---------------------------------------------------------------------------
// Resources schema types (describing the JS/REST client resource structure)
// ---------------------------------------------------------------------------

export type ResourcesRawEndpoint = {
  rel: string;
  name?: string;
  rawName: string;
  returnsCollection: boolean;
  urlTemplate: string;
  method: string;
  comment: string;
  docUrl?: string;
  urlPlaceholders: Array<{
    variableName: string;
    isEntityId: boolean;
    relType: string;
  }>;
  entityIdPlaceholder?: {
    variableName: string;
    isEntityId: boolean;
    relType: string;
  };
  simpleMethodAvailable: boolean;
  requestBodyType?: string;
  optionalRequestBody: boolean;
  requestStructure?: {
    type: string;
    idRequired?: boolean;
    attributes: string[] | '*';
    relationships: string[] | '*';
  };
  queryParamsType?: string;
  queryParamsRequired?: boolean;
  responseType?: string;
  deprecated?: string;
  paginatedResponse?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

export type ResourcesEndpoint = {
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
} & ResourcesRawEndpoint;

export type ResourcesEntity = {
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
  endpoints: ResourcesEndpoint[];
};

export type ResourcesSchema = ResourcesEntity[];

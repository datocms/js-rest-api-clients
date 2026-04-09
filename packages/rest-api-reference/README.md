[![Node.js CI](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml/badge.svg)](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml)

# DatoCMS REST API Reference

Utilities to browse [DatoCMS](https://www.datocms.com) REST API reference documentation programmatically. Fetches and dereferences the official hyperschema, parses the resources schema, and renders Markdown descriptions of resources and their actions.

<br /><br />
<a href="https://www.datocms.com/">
<img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

## Installation

```bash
npm install @datocms/rest-api-reference
```

## Usage

```typescript
import {
  fetchHyperschema,
  parseResourcesSchema,
  listResources,
  describeResource,
  describeResourceAction,
} from '@datocms/rest-api-reference';

// Fetch and dereference a hyperschema using a shorthand...
const hyperschema = await fetchHyperschema('cma');

// ...or the dashboard API
const dashboardSchema = await fetchHyperschema('dashboard');

// ...or a custom URL
const custom = await fetchHyperschema('https://example.com/schema.json');

// Parse a resources.json file (shipped with @datocms/cma-client)
const resourcesSchema = parseResourcesSchema(rawResourcesJson);

// List all available resources grouped by theme
const listing = listResources(hyperschema, resourcesSchema);

// Describe a specific resource and its available actions
const resource = describeResource(hyperschema, resourcesSchema, 'items');

// Describe a specific action with examples
const action = describeResourceAction(
  hyperschema,
  resourcesSchema,
  'items',
  'create',
);
```

### Expanding `<details>` blocks

`describeResource` and `describeResourceAction` accept an optional `expandDetails` parameter — an array of `<summary>` texts to expand. When provided, only matching `<details>` blocks are returned, fully open:

```typescript
const expanded = describeResourceAction(
  hyperschema,
  resourcesSchema,
  'items',
  'create',
  ['Example: Basic creation'],
);
```

### Lower-level utilities

The package also exports finder functions and a Markdown builder:

```typescript
import {
  findHyperschemaEntity,
  findHyperschemaLink,
  findResourcesEntityByJsonApiType,
  findResourcesEntityByNamespace,
  findResourcesEndpointByRel,
  render,
  h1,
  h2,
  p,
  ul,
  li,
  code,
} from '@datocms/rest-api-reference';
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/datocms/js-rest-api-clients. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

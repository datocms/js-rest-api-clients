# `@datocms/cma-client`

> TODO: description

## Usage (NodeJS)

```js
const { buildClient } = require('@datocms/cma-client');

const client = buildClient({ apiToken: 'XXX' });
const items = await client.items.list();
```

## Usage (browser module)

```html
<script type="module">
  // also valid: https://cdn.jsdelivr.net/npm/@datocms/cma-client/dist/browser/index.js
  import { buildClient } from 'https://unpkg.com/@datocms/cma-client/dist/browser/index.js';

  const client = buildClient({ apiToken: 'XXX' });
  const items = await client.items.list();
</script>
```

# `@datocms/dashboard-client`

## Usage (NodeJS)

```js
const { Client } = require('@datocms/dashboard-client');

const client = new Client({ apiToken: 'XXX' });
const items = await client.items.list();
```

## Usage (browser module)

```html
<script type="module">
  // also valid: https://cdn.jsdelivr.net/npm/@datocms/dashboard-client/dist/browser/index.js
  import { Client } from 'https://unpkg.com/@datocms/dashboard-client/dist/browser/index.js';

  const client = new Client({ apiToken: 'XXX' });
  const items = await client.items.list();
</script>
```

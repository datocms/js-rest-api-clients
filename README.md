<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

[![Node.js CI](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml/badge.svg)](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml)

# DatoCMS JS REST API Clients

This monorepo contains API clients to interact with DatoCMS:

- `@datocms/cma-client-browser`: Client for the [Content Management API](https://www.datocms.com/docs/content-management-api) (to be used in browser environments).
- `@datocms/cma-client-node`: Client for the [Content Management API](https://www.datocms.com/docs/content-management-api) (to be used in NodeJS environments).
- `@datocms/dashboard-client`: Client for the Dashboard Management API (can be used in any JS environment).
- `@datocms/rest-api-events`: Can be used with any of the above clients to use real-time updates instead of polling to retrieve the result of asyncronous jobs.

You can read more on how to use these clients on the [official documentation page](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients).

Looking for a client for the GraphQL [Content Delivery API](https://www.datocms.com/docs/content-delivery-api)? It's here: [@datocms/cda-client](https://github.com/datocms/cda-client)

## Development

After checking out the repo, run the following:

```
npm install
lerna bootstrap
npm run build
```

Then, to run the test suite: `npm run test`.

To regenerate the code based on the latest DatoCMS JSON API schema:

```
npm run generate
npm run build
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/datocms/js-rest-api-clients. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->

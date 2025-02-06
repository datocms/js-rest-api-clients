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
<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agency partners, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Quick links:**

- ⚡️ Get started with a [free DatoCMS account](https://dashboard.datocms.com/signup)
- 🔖 Go through the [docs](https://www.datocms.com/docs)
- ⚙️ Get [support from us and the community](https://community.datocms.com/)
- 🆕 Stay up to date on new features and fixes on the [changelog](https://www.datocms.com/product-updates)

**Our featured repos:**
- [datocms/react-datocms](https://github.com/datocms/react-datocms): React helper components for images, Structured Text rendering, and more
- [datocms/js-rest-api-clients](https://github.com/datocms/js-rest-api-clients): Node and browser JavaScript clients for updating and administering your content. For frontend fetches, we recommend using our [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) instead.
- [datocms/cli](https://github.com/datocms/cli): Command-line interface that includes our [Contentful importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [Wordpress importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress)
- [datocms/plugins](https://github.com/datocms/plugins): Example plugins we've made that extend the editor/admin dashboard
- [DatoCMS Starters](https://www.datocms.com/marketplace/starters) has examples for various Javascript frontend frameworks

Or see [all our public repos](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)

<!--datocms-autoinclude-footer end-->

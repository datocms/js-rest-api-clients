import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Site extends BaseResource {
  static readonly TYPE: 'site' = 'site';

  /**
   * Retrieve a project
   */
  find(siteId: string | SimpleSchemaTypes.SiteData) {
    return this.rawFind(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a project
   */
  rawFind(siteId: string): Promise<SchemaTypes.SiteSelfTargetSchema> {
    return this.client.request<SchemaTypes.SiteSelfTargetSchema>({
      method: 'GET',
      url: `/sites/${siteId}`,
    });
  }

  /**
   * List all projects
   */
  list(queryParams?: SimpleSchemaTypes.SiteInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all projects
   */
  rawList(
    queryParams?: SchemaTypes.SiteInstancesHrefSchema,
  ): Promise<SchemaTypes.SiteInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SiteInstancesTargetSchema>({
      method: 'GET',
      url: `/sites`,
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   */
  async *listPagedIterator(
    queryParams?: SimpleSchemaTypes.SiteInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.SiteInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   */
  rawListPagedIterator(
    queryParams?: SchemaTypes.SiteInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    return Utils.rawPageIterator<
      SchemaTypes.SiteInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 20,
        maxLimit: 50,
      },
      (page) => this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Create a new project
   */
  create(body: SimpleSchemaTypes.SiteCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.SiteCreateSchema>(body, {
        type: 'site',
        attributes: ['name', 'internal_subdomain', 'template'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteCreateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new project
   */
  rawCreate(
    body: SchemaTypes.SiteCreateSchema,
  ): Promise<SchemaTypes.SiteCreateJobSchema> {
    return this.client.request<SchemaTypes.SiteCreateJobSchema>({
      method: 'POST',
      url: `/sites`,
      body,
    });
  }

  /**
   * Update project
   */
  update(
    siteId: string | SimpleSchemaTypes.SiteData,
    body: SimpleSchemaTypes.SiteUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(siteId),
      Utils.serializeRequestBody<SchemaTypes.SiteUpdateSchema>(body, {
        id: Utils.toId(siteId),
        type: 'site',
        attributes: [
          'name',
          'domain',
          'internal_subdomain',
          'is_public_template',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update project
   */
  rawUpdate(
    siteId: string,
    body: SchemaTypes.SiteUpdateSchema,
  ): Promise<SchemaTypes.SiteUpdateTargetSchema> {
    return this.client.request<SchemaTypes.SiteUpdateTargetSchema>({
      method: 'PUT',
      url: `/sites/${siteId}`,
      body,
    });
  }

  /**
   * Delete a project
   */
  destroy(siteId: string | SimpleSchemaTypes.SiteData) {
    return this.rawDestroy(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a project
   */
  rawDestroy(siteId: string): Promise<SchemaTypes.SiteDestroyJobSchema> {
    return this.client.request<SchemaTypes.SiteDestroyJobSchema>({
      method: 'DELETE',
      url: `/sites/${siteId}`,
    });
  }

  /**
   * Duplicate an existing project
   */
  rawDuplicate(
    siteId: string,
    body: SchemaTypes.SiteDuplicateSchema,
  ): Promise<SchemaTypes.SiteDuplicateJobSchema> {
    return this.client.request<SchemaTypes.SiteDuplicateJobSchema>({
      method: 'POST',
      url: `/sites/${siteId}/duplicate`,
      body,
    });
  }
}

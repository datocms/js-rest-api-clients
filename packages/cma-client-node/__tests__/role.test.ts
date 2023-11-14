import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('role', () => {
  it.concurrent('create, find, list, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const currentEnvironmentId =
      client.config.environment ||
      (await client.environments.list()).find(
        (environment) => environment.meta.primary,
      )!.id;

    const role = await client.roles.create({
      name: 'Translator',
      positive_item_type_permissions: [
        {
          environment: currentEnvironmentId,
          action: 'read',
          on_creator: 'anyone',
        },
        {
          environment: currentEnvironmentId,
          action: 'update',
          on_creator: 'anyone',
          localization_scope: 'all',
        },
      ],
      negative_item_type_permissions: [
        {
          environment: currentEnvironmentId,
          action: 'read',
          on_creator: 'anyone',
        },
        {
          environment: currentEnvironmentId,
          action: 'update',
          on_creator: 'anyone',
          localization_scope: 'all',
        },
      ],
      positive_upload_permissions: [
        {
          environment: currentEnvironmentId,
          action: 'read',
          on_creator: 'anyone',
        },
        {
          environment: currentEnvironmentId,
          action: 'update',
          on_creator: 'anyone',
          localization_scope: 'all',
        },
      ],
      negative_upload_permissions: [
        {
          environment: currentEnvironmentId,
          action: 'read',
          on_creator: 'anyone',
        },
        {
          environment: currentEnvironmentId,
          action: 'update',
          on_creator: 'anyone',
          localization_scope: 'all',
        },
      ],
    });
    expect(role.name).toEqual('Translator');

    const foundRole = await client.roles.find(role);
    expect(foundRole.id).toEqual(role.id);

    const allRoles = await client.roles.list();
    expect(allRoles).toHaveLength(3);

    const updatedRole = await client.roles.update(role, {
      ...role,
      name: 'Updated',
    });
    expect(updatedRole.name).toEqual('Updated');

    const newlyUpdatedRole =
      await client.roles.updateCurrentEnvironmentPermissions(updatedRole, {
        positive_item_type_permissions: {
          remove: [
            {
              action: 'update',
              on_creator: 'anyone',
              localization_scope: 'all',
            },
          ],
          add: [
            {
              action: 'create',
              localization_scope: 'all',
            },
          ],
        },
        negative_item_type_permissions: {
          remove: [
            {
              action: 'update',
              on_creator: 'anyone',
              localization_scope: 'all',
            },
          ],
          add: [
            {
              action: 'create',
              localization_scope: 'all',
            },
          ],
        },
        positive_upload_permissions: {
          remove: [
            {
              action: 'update',
              on_creator: 'anyone',
              localization_scope: 'all',
            },
          ],
          add: [
            {
              action: 'create',
            },
          ],
        },
        negative_upload_permissions: {
          remove: [
            {
              action: 'update',
              on_creator: 'anyone',
              localization_scope: 'all',
            },
          ],
          add: [
            {
              action: 'create',
            },
          ],
        },
      });

    expect(newlyUpdatedRole.positive_item_type_permissions).toHaveLength(2);
    expect(
      newlyUpdatedRole.positive_item_type_permissions.map((r) => r.action),
    ).toContain('create');
    expect(
      newlyUpdatedRole.positive_item_type_permissions.map((r) => r.action),
    ).toContain('read');

    expect(newlyUpdatedRole.negative_item_type_permissions).toHaveLength(2);
    expect(
      newlyUpdatedRole.negative_item_type_permissions.map((r) => r.action),
    ).toContain('create');
    expect(
      newlyUpdatedRole.negative_item_type_permissions.map((r) => r.action),
    ).toContain('read');

    expect(newlyUpdatedRole.positive_upload_permissions).toHaveLength(2);
    expect(
      newlyUpdatedRole.positive_upload_permissions.map((r) => r.action),
    ).toContain('create');
    expect(
      newlyUpdatedRole.positive_upload_permissions.map((r) => r.action),
    ).toContain('read');

    expect(newlyUpdatedRole.negative_upload_permissions).toHaveLength(2);
    expect(
      newlyUpdatedRole.negative_upload_permissions.map((r) => r.action),
    ).toContain('create');
    expect(
      newlyUpdatedRole.negative_upload_permissions.map((r) => r.action),
    ).toContain('read');

    await client.roles.destroy(role);
    expect(await client.roles.list()).toHaveLength(2);
  });
});

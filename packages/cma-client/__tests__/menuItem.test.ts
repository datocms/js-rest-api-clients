import { generateNewCmaClient } from './helpers/generateClients';
import u from 'updeep';
import { MenuItemUpdateSchema } from '../src/cma/SimpleSchemaTypes';

describe('menu item', () => {
  test('create, find, list, update, destroy', async () => {
    // TODO: Fallisce perché relationships é marcato come required anche se nessuna delle
    // due relationships èrequired.
    const client = await generateNewCmaClient();
    const menuItem = await client.menuItems.create({
      label: 'Browse Articles',
      position: 1,
    });
    expect(menuItem.label).toEqual('Browse Articles');

    const foundMenuItems = await client.menuItems.find(menuItem.id);
    expect(foundMenuItems.id).toEqual(menuItem.id);

    const allMenuItems = await client.menuItems.list();
    expect(allMenuItems).toHaveLength(1);

    const updatedMenuItems = await client.menuItems.update(
      menuItem.id,
      u({ label: 'Updated' }, menuItem) as MenuItemUpdateSchema,
    );
    expect(updatedMenuItems.label).toEqual('Updated');

    await client.menuItems.destroy(menuItem.id);
    expect(await client.menuItems.list()).toHaveLength(0);
  });
});

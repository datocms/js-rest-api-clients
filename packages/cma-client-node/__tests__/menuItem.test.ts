import { LogLevel } from '../src';
import { generateNewCmaClient } from './helpers/generateClients';

describe('menu item', () => {
  test('create, find, list, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const menuItem = await client.menuItems.create({
      label: 'Browse Articles',
      position: 1,
    });

    expect(menuItem.label).toEqual('Browse Articles');

    const foundMenuItems = await client.menuItems.find(menuItem);
    expect(foundMenuItems.id).toEqual(menuItem.id);

    const allMenuItems = await client.menuItems.list();
    expect(allMenuItems).toHaveLength(1);

    const updatedMenuItems = await client.menuItems.update(menuItem, {
      ...menuItem,
      label: 'Updated',
    });
    expect(updatedMenuItems.label).toEqual('Updated');

    await client.menuItems.destroy(menuItem);
    expect(await client.menuItems.list()).toHaveLength(0);
  });
});

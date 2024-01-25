import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('site', () => {
  it.concurrent('find, update', async () => {
    const client = await generateNewCmaClient();

    const fetchedSite = await client.site.find();
    expect(fetchedSite.name).toContain('Project');

    const randomString =
      Math.random().toString(36).substring(7) + new Date().getTime();

    const newName = `New project ${randomString}`;

    const updatedSite = await client.site.update({ name: newName });
    expect(updatedSite.name).toEqual(newName);
  });
});

import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('Workflow settings', () => {
  it.concurrent('create, find, list, destroy', async () => {
    const client = await generateNewCmaClient();

    const workflow = await client.workflows.create({
      api_key: 'approval_by_editors',
      name: 'Approval by editors required',
      stages: [
        {
          id: 'waiting_for_review',
          name: 'Waiting for review',
          initial: true,
        },
      ],
    });
    expect(workflow.api_key).toEqual('approval_by_editors');

    const found = await client.workflows.find(workflow);
    expect(found.api_key).toEqual('approval_by_editors');

    const updated = await client.workflows.update(workflow, {
      name: 'updated',
    });
    expect(updated.name).toEqual('updated');

    await client.workflows.destroy(workflow);
    expect(await client.workflows.list()).toHaveLength(0);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const workflow = await client.workflows.create({
      id: newId,
      api_key: 'approval_by_editors',
      name: 'Approval by editors required',
      stages: [
        {
          id: 'waiting_for_review',
          name: 'Waiting for review',
          initial: true,
        },
      ],
    });
    expect(workflow.id).toEqual(newId);
  });
});

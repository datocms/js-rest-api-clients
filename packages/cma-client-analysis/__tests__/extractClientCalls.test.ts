import { extractClientCalls } from '../src';

describe('extractClientCalls', () => {
  it('extracts a simple await call', () => {
    const calls = extractClientCalls('const x = await client.items.list();');
    expect(calls).toEqual([{ resource: 'items', method: 'list' }]);
  });

  it('de-duplicates identical calls', () => {
    const calls = extractClientCalls(
      'await client.items.list(); await client.items.list();',
    );
    expect(calls).toEqual([{ resource: 'items', method: 'list' }]);
  });

  it('picks up calls with type arguments', () => {
    const calls = extractClientCalls(
      'await client.items.create<Schema.Post>({ title: "hi" });',
    );
    expect(calls).toEqual([{ resource: 'items', method: 'create' }]);
  });

  it('walks nested calls (returned iterators, chained access)', () => {
    const calls = extractClientCalls(
      'for await (const r of client.items.rawListPagedIterator({})) { console.log(r); }',
    );
    expect(calls).toEqual([
      { resource: 'items', method: 'rawListPagedIterator' },
    ]);
  });

  it('collects distinct resource.method pairs', () => {
    const calls = extractClientCalls(`
      await client.items.find("x");
      await client.items.update("x", {});
      await client.schemas.list();
    `);
    expect(calls).toEqual([
      { resource: 'items', method: 'find' },
      { resource: 'items', method: 'update' },
      { resource: 'schemas', method: 'list' },
    ]);
  });

  it('ignores aliased clients (acceptable loophole, not adversarial)', () => {
    const calls = extractClientCalls(
      'const c = client; await c.items.find("x");',
    );
    expect(calls).toEqual([]);
  });

  it('ignores property access without a call', () => {
    const calls = extractClientCalls('const resource = client.items;');
    expect(calls).toEqual([]);
  });
});

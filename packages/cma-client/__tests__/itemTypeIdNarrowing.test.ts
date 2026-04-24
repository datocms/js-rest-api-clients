import { type ItemTypeDefinition, buildBlockRecord } from '../src';

type Settings = { locales: 'en' };

const SESSION_BLOCK_ID = 'sessionBlockId00000001' as const;
const BREAK_BLOCK_ID = 'breakBlockId000000001A' as const;
const KEYNOTE_BLOCK_ID = 'keynoteBlockId0000001B' as const;

type SessionBlock = ItemTypeDefinition<
  Settings,
  typeof SESSION_BLOCK_ID,
  {
    label: { type: 'string' };
    signup_url: { type: 'string' };
  }
>;

type BreakBlock = ItemTypeDefinition<
  Settings,
  typeof BREAK_BLOCK_ID,
  {
    duration_minutes: { type: 'integer' };
  }
>;

type KeynoteBlock = ItemTypeDefinition<
  Settings,
  typeof KEYNOTE_BLOCK_ID,
  {
    speaker: { type: 'string' };
  }
>;

const sessionBlock = (label: string, signup_url: string) =>
  buildBlockRecord<SessionBlock>({
    item_type: { type: 'item_type', id: SESSION_BLOCK_ID },
    label,
    signup_url,
  });

const breakBlock = (duration_minutes: number) =>
  buildBlockRecord<BreakBlock>({
    item_type: { type: 'item_type', id: BREAK_BLOCK_ID },
    duration_minutes,
  });

const keynoteBlock = (speaker: string) =>
  buildBlockRecord<KeynoteBlock>({
    item_type: { type: 'item_type', id: KEYNOTE_BLOCK_ID },
    speaker,
  });

describe('narrowing with __itemTypeId', () => {
  describe('direct if/else narrowing', () => {
    it('narrows a single block via top-level __itemTypeId', () => {
      const block: ReturnType<
        typeof sessionBlock | typeof breakBlock | typeof keynoteBlock
      > = sessionBlock('Intro', 'https://x/1');

      if (block.__itemTypeId === SESSION_BLOCK_ID) {
        // Narrowed — signup_url is accessible
        expect(block.attributes.signup_url).toBe('https://x/1');
      } else {
        fail('expected SessionBlock');
      }
    });
  });

  describe('over a block union with Array#filter', () => {
    const agenda = [
      sessionBlock('Intro', 'https://x/1'),
      breakBlock(15),
      sessionBlock('Deep dive', 'https://x/2'),
      keynoteBlock('Ada'),
    ];

    it('filters to blocks of the matching model at runtime', () => {
      // Inline arrow — no type guard — so the return type is the full union.
      // We assert the right shape via runtime only.
      const sessions = agenda.filter(
        (b) => b.__itemTypeId === SESSION_BLOCK_ID,
      );
      expect(sessions).toHaveLength(2);
    });

    it('needs a user-defined type guard to narrow in filter', () => {
      // To get narrowing, we have to hand-write exactly the kind of guard
      // that `isBlockOfType` would provide. (Can't use Extract here because
      // __itemTypeId is optional on the type level.)
      type Elem = (typeof agenda)[number];
      const isSession = (b: Elem): b is ReturnType<typeof sessionBlock> =>
        b.__itemTypeId === SESSION_BLOCK_ID;

      const sessions = agenda.filter(isSession);
      expect(sessions).toHaveLength(2);
      expect(sessions.map((s) => s.attributes.signup_url)).toEqual([
        'https://x/1',
        'https://x/2',
      ]);
    });
  });

  describe('buildBlockRecord carries __itemTypeId', () => {
    it('locally-built blocks expose __itemTypeId for narrowing parity with API responses', () => {
      const raw = buildBlockRecord<SessionBlock>({
        item_type: { type: 'item_type', id: SESSION_BLOCK_ID },
        label: 'x',
        signup_url: 'y',
      });
      expect(raw.__itemTypeId).toBe(SESSION_BLOCK_ID);
    });

    it('id-only update payload (no item_type) leaves __itemTypeId undefined and does not throw', () => {
      // UpdateBlockRecordSchema.item_type is optional — callers updating an
      // existing block by id may omit it. The helper must not assume
      // item_type is present when deriving __itemTypeId.
      const raw = buildBlockRecord<SessionBlock>({
        id: 'someBlockId000000001X',
        label: 'x',
      });
      expect(raw.__itemTypeId).toBeUndefined();
    });

    it('honors an explicit __itemTypeId on the input when item_type is absent', () => {
      const raw = buildBlockRecord<SessionBlock>({
        id: 'someBlockId000000001X',
        __itemTypeId: SESSION_BLOCK_ID,
        label: 'x',
      });
      expect(raw.__itemTypeId).toBe(SESSION_BLOCK_ID);
    });
  });
});

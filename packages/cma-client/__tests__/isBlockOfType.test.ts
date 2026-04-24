import { type ItemTypeDefinition, buildBlockRecord } from '../src';
import { isBlockOfType } from '../src/utilities/isBlockOfType';

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

describe('isBlockOfType', () => {
  describe('over a block union', () => {
    const agenda = [
      sessionBlock('Intro', 'https://x/1'),
      breakBlock(15),
      sessionBlock('Deep dive', 'https://x/2'),
      keynoteBlock('Ada'),
    ];

    it('filters to blocks of the matching model', () => {
      const sessions = agenda.filter(isBlockOfType(SESSION_BLOCK_ID));
      expect(sessions).toHaveLength(2);
      expect(sessions.map((s) => s.attributes.signup_url)).toEqual([
        'https://x/1',
        'https://x/2',
      ]);
    });

    it('returns an empty array when no block matches', () => {
      const noSuchId = 'doesNotExist00000000Ab' as const;
      const nothing = agenda.filter(isBlockOfType(noSuchId));
      expect(nothing).toHaveLength(0);
    });

    it('is usable with Array#find', () => {
      const first = agenda.find(isBlockOfType(KEYNOTE_BLOCK_ID));
      expect(first?.attributes.speaker).toBe('Ada');
    });
  });

  describe('over a request-payload array with plain string IDs mixed in', () => {
    const agendaPayload: Array<
      string | ReturnType<typeof sessionBlock | typeof breakBlock>
    > = [
      'existingBlockId000001X',
      sessionBlock('Intro', 'https://x/1'),
      breakBlock(10),
    ];

    it('excludes plain string IDs (not narrowable)', () => {
      const sessions = agendaPayload.filter(isBlockOfType(SESSION_BLOCK_ID));
      expect(sessions).toHaveLength(1);
      expect(sessions[0]!.attributes.signup_url).toBe('https://x/1');
    });
  });

  describe('edge cases', () => {
    const guard = isBlockOfType(SESSION_BLOCK_ID);

    it('returns false for null / undefined / primitives', () => {
      expect(guard(null)).toBe(false);
      expect(guard(undefined)).toBe(false);
      expect(guard('abc')).toBe(false);
      expect(guard(42)).toBe(false);
    });

    it('returns false for objects missing the relationships path', () => {
      expect(guard({})).toBe(false);
      expect(guard({ relationships: null })).toBe(false);
      expect(guard({ relationships: {} })).toBe(false);
      expect(guard({ relationships: { item_type: null } })).toBe(false);
      expect(guard({ relationships: { item_type: { data: null } } })).toBe(
        false,
      );
    });

    it('returns false when the item_type id does not match', () => {
      expect(guard(breakBlock(5))).toBe(false);
    });

    it('returns true for a matching block produced by buildBlockRecord', () => {
      expect(guard(sessionBlock('x', 'y'))).toBe(true);
    });
  });

  describe('type-level narrowing', () => {
    it('narrows the union member inside the filter callback', () => {
      const agenda = [sessionBlock('x', 'y'), breakBlock(1)];

      const sessions = agenda.filter(isBlockOfType(SESSION_BLOCK_ID));

      // If narrowing didn't work, accessing `signup_url` would be a type error
      // (BreakBlock has no such attribute).
      const urls: Array<string | null | undefined> = sessions.map(
        (s) => s.attributes.signup_url,
      );
      expect(urls).toEqual(['y']);
    });
  });
});

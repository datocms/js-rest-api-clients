import { withJitter } from '../wait';

describe('withJitter()', () => {
  it('never returns less than the base wait', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(withJitter(2)).toBe(2);
    expect(withJitter(45)).toBe(45);
    randomSpy.mockRestore();
  });

  it('doubles a base wait smaller than the cap', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(1);
    expect(withJitter(2)).toBe(4);
    randomSpy.mockRestore();
  });

  it('caps the extra wait for a base larger than the cap', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(1);
    expect(withJitter(45)).toBe(50);
    randomSpy.mockRestore();
  });
});

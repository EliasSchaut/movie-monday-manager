import { RandomService } from '@/common/services/random.service';

describe('RandomService', () => {
  describe('arr_random_element', () => {
    it('returns an element from the array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = RandomService.arr_random_element(arr);
      expect(arr).toContain(result);
    });

    it('returns undefined for an empty array', () => {
      const arr: any[] = [];
      const result = RandomService.arr_random_element(arr);
      expect(result).toBeUndefined();
    });

    it('returns the only element for a single-element array', () => {
      const arr = [42];
      const result = RandomService.arr_random_element(arr);
      expect(result).toBe(42);
    });

    it('handles arrays with different types of elements', () => {
      const arr = [1, 'two', { three: 3 }, [4], null];
      const result = RandomService.arr_random_element(arr);
      expect(arr).toContain(result);
    });
  });
});

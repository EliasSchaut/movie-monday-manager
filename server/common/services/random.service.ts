import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  public static arr_random_element(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

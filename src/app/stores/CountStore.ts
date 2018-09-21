import { observable } from 'mobx';

export class CountStore {
  @observable
  public count: number = 0;

  public addCount = () => {
    this.count++;
  }

  public reduceCount = () => {
    this.count--;
  }
}

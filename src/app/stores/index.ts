import { createBrowserHistory } from 'history';

import {
  COUNT_ROUTER,
  STORE_ROUTER
} from '@constants/stores';

import { CountStore } from './CountStore';
import { RouterStore } from './RouterStore';

const history = createBrowserHistory();

const routerStore = new RouterStore(history);
const countStore = new CountStore();

const rootStores = {
  [STORE_ROUTER]: routerStore,
  [COUNT_ROUTER]: countStore
};

export default rootStores;
export {
  RouterStore,
  CountStore
};

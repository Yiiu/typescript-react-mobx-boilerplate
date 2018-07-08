import { createBrowserHistory } from 'history';

import {
  STORE_ROUTER,
  COUNT_ROUTER
} from '@constants/stores';


import { RouterStore } from './RouterStore';
import { CountStore } from './CountStore';

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
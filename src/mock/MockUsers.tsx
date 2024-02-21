import {InMemoryCache, ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {mockQueryData} from '.';
import {samples as users, User, GET_CURRENT_USER_QL, SET_CURRENT_USER_KEY, notLoggedinUser} from '../models/users';
import { queryMock as mockSlots } from './MockSlots';

let currentUser = notLoggedinUser;
export function queryMock(cache: InMemoryCache) {
  mockQueryData('user', users, cache);
  cache.writeQuery({
    query: GET_CURRENT_USER_QL(),
    data: {currentUser},
  });
}

export const resolverMock = {
  Mutation: {
    [SET_CURRENT_USER_KEY]: (_root, variables: Partial<User>, {client, cache}: {client: ApolloClient<NormalizedCacheObject>, cache: InMemoryCache}) => {
      currentUser = users.find(u => u.id === variables.id);
      queryMock(cache);
      mockSlots(cache);
      return currentUser;
    }
  }
};

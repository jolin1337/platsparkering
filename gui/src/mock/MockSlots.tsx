import {ApolloClient, InMemoryCache, NormalizedCacheObject} from '@apollo/client';
import {mockQueryData} from '.';
import {samples as slots, ADD_SLOT_MUTATION_KEY, Slot} from '../models/slots';

export function queryMock(cache: InMemoryCache) {
  const currentUser = parseInt(window.localStorage.getItem('currentUser')) || -1;
  mockQueryData('slot', slots, cache);
  mockQueryData('slot', slots, cache, 'id');
  mockQueryData('mySlot', slots.filter(s => s.owner.id === currentUser), cache);
  //users.map(({id}) => mockQueryData('userSlot', slots.filter(s => s.owner.id === id), cache, {owner: {id}}));
}

export const resolverMock = {
  Mutation: {
    [ADD_SLOT_MUTATION_KEY]: (_root, variables: Slot, {cache}: {client: ApolloClient<NormalizedCacheObject>, cache: InMemoryCache}) => {
      slots.push({...variables, id: Math.round(Math.random() * 100000)});
      queryMock(cache);
      return slots[slots.length - 1];
    }
  }
};

import {InMemoryCache} from '@apollo/client';
import {mockQueryData} from '.';
import {samples as allUsers} from '../models/users';
import {samples as allBookeadSchedules} from '../models/BookedSchedules';

export function queryMock(cache: InMemoryCache) {
  mockQueryData('booked_schedule', allBookeadSchedules, cache);
  mockQueryData('booked_schedule', allBookeadSchedules, cache, 'id');
  allUsers.map(({id}) => mockQueryData('booked_schedule', allBookeadSchedules.filter(rs => rs.slotOwnerId === id), cache, {slotOwnerId: id}));
  allUsers.map(({id}) => mockQueryData('booked_schedule', allBookeadSchedules.filter(rs => rs.carOwnerId === id), cache, {carOwnerId: id}));
}

export const resolverMock = {
  Mutation: {
  }
};

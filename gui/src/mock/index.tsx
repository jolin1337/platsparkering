import {gql, InMemoryCache} from '@apollo/client';
import {queryMock as allSlotsMock, resolverMock as allSlotsResolvers} from './MockSlots';
import {queryMock as allUsersMock, resolverMock as allUsersResolvers} from './MockUsers';
import {queryMock as allRepeatingSchedules, resolverMock as allRepeatingSchedulesResolvers} from './MockBookedSchedules';

function getFilterTypeString(filters: any, prefix: string = '') {
  const typeMapping = {
    number: 'Float!',
    string: 'String!'
  };
  return (
      Object.keys(filters)
      .filter(f => typeof filters[f] !== 'object')
      .map(f => `$${prefix}${f}: ${typeMapping[typeof(filters[f])]}`).join(', ')
  );
}
function getFilterString(filters: any, prefix: string = '') {
  return (
      Object.keys(filters)
      .filter(f => typeof filters[f] !== 'object')
      .map(f => `${f}: $${prefix}${f}`).join(', ')
  );
}

export const mockQueryData = (name: string, data: Array<any>, cache: InMemoryCache, filter = null) => {
  const keys = Object.keys(data[0] || {id: null});
  if (filter === 'id') {
    const slotQuery = gql`
      query ${name}($id: Int!) {
        ${name} (id: $id) {
          ${keys.join("\n          ")}
        }
      }`;
    data.forEach(item => {
      cache.writeQuery({
        query: slotQuery,
        data: {
          [name]: item
        },
        variables: {
          id: item.id
        }
      });
    });
    return;
  }
  let gqlFilter = '';
  let gqlFilterParam = '';
  let mapKeys = [...keys, ...Object.keys(filter || {})];
  mapKeys = mapKeys.filter((k, i) => mapKeys.indexOf(k) === i);
  if (filter !== null) {
    const kv = getFilterString(filter);
    gqlFilterParam = '(';
    if (kv.length > 0) {
      gqlFilter = `(filter: {${kv}})`;
      gqlFilterParam += `${getFilterTypeString(filter)}`;
    }
    mapKeys = mapKeys.map(k => {
      let q = '';
      if (filter[k] && typeof filter[k] === 'object') {
        let ok = [...Object.keys((data[0] || {})[k] || {}), ...Object.keys(filter[k])];
        ok = ok.filter((k, i) => i === ok.indexOf(k));
        q = `(filter: {${getFilterString(filter[k], k + '_')}}) {
          ${ok.join('\n')}
        }`;
        gqlFilterParam += (gqlFilterParam.length === 1 ? '' : ',') + getFilterTypeString(filter[k], k + '_');
        Object.keys(filter[k]).forEach(p => {
          filter[k + '_' + p] = filter[k][p];
        });
        delete filter[k];
      }
      return k + ' ' + q;
    });
    gqlFilterParam += ')';
    if (gqlFilterParam === '()') gqlFilterParam = '';
  }
  const query = gql`
    query ${name}s ${gqlFilterParam} {
      ${name}s ${gqlFilter} {
        ${mapKeys.join("\n        ")}
      }
    }`;
  // console.log(query.loc.source.body, name,  filter, data);
  cache.writeQuery({
    query,
    data: {
      [name + 's']: data
    },
    variables: filter || {},
  });
};

export const allQueryMocks = [
  allSlotsMock,
  allUsersMock,
  allRepeatingSchedules,
];

export const allResolverMocks = {
  Mutation: {
    ...allRepeatingSchedulesResolvers.Mutation,
    ...allSlotsResolvers.Mutation,
    ...allUsersResolvers.Mutation
  }
}

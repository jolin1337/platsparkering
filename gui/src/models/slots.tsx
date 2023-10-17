import {DocumentNode, gql} from '@apollo/client';
import {Schedule, ScheduleInterval} from './schedule';
import {samples as users, User} from './users';

export const GET_SLOT_QL = (id: number): [DocumentNode, {variables: Partial<Slot>}] => [gql`
  query slot ($id: Int!){
    slot(id: $id) {
      id
      picture
      price
      adress
      location
      owner
      stars
      properties
      description
      availability
    }
  }
`, {variables: {id: id}}];

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

function getFilterString(filters: any, prefix: string = '') {
  return (
      Object.keys(filters)
      .filter(f => typeof filters[f] !== 'object')
      .map(f => `${f}: $${prefix}${f}`).join(', ')
  );
}
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

export const GET_SLOTS_QL = (filters?: RecursivePartial<Slot>): [DocumentNode, {variables: RecursivePartial<Slot>}] => {
  let slotKey = 'slots';
  let q = '';
  let oq = '';
  let pq = '';
  let params = '';
  if (filters) {
    const fq = getFilterString(filters);
    params += '(';
    if (fq) {
      q = `(filter: {${fq}})`;
      params += getFilterTypeString(filters);
    }
    if (filters.owner) {
      slotKey = 'userSlot';
      oq = `(filter: {${getFilterString(filters.owner, 'owner_')}})`;
      params += (params.length > 1 ? ',' : '') + getFilterTypeString(filters.owner, 'owner_');
      Object.keys(filters.owner).forEach(o => {
        filters['owner_' + o] = filters.owner[o];
      });
    }
    if (filters.properties) {
      params += (params.length > 1 ? ',' : '') + getFilterTypeString(filters.owner, 'owner_');
      pq = `(filter: {${getFilterString(filters.properties, 'properties_')}})`;
      Object.keys(filters.properties).forEach(p => {
        filters['properties_' + p] = filters.properties[p];
      });
    }
    params += ')';
  }
  return [gql`
    query ${slotKey} ${params} {
      ${slotKey} ${q}{
        id
        adress
        location
        picture
        price
        owner ${oq}
        description
        stars
        properties ${pq}
      }
    }`,
  {variables: filters}];
}

export const GET_MY_SLOTS_QL = (): [DocumentNode] => {
  return [gql`
    query MySlots {
      mySlots {
        id
        adress
        location
        picture
        price
        owner
        description
        stars
        properties
      }
    }
  `];
}

export const ADD_SLOT_MUTATION_KEY = 'addSlot';
export const ADD_SLOT = gql`
  mutation AddSlot($adress: String!, $location: [Float]!, $picture: String!, $price: Float!, $description: String!, $stars: Int!, $properties: String!, $owner: String!, $availability: Strin!) {
    ${ADD_SLOT_MUTATION_KEY}(adress: $adress, location: $location, picture: $picture, price: $price, description: $description, stars: $stars, properties: $properties, owner: $owner, availability: $availability) @client
  }
`;

export enum SlotSize {
  small = "small",
  medium = "medium",
  large = "large",
};

export interface SlotProperties {
  size: SlotSize
  garage?: boolean
  charge?: boolean
  fastCharge?: boolean
}

export interface Slot {
  id: number
  adress: string
  location: Array<number>
  picture: string
  price: number
  owner: User
  description?: string
  stars: number
  properties: SlotProperties
  availability: Schedule
};

export const samples: Array<Slot> = [
  {
    "id": 2,
    "adress": "Storgatan 14, Sundsvall",
    "location": [
      62.390770, 17.311732
    ],
    "stars": 4.5,
    "price": 4,
    "picture": "./images/park-sample.png",
    "properties": {
      "size": SlotSize.medium,
    },
    "description": "Väldigt vacker parkering i ett trevligt område.",
    "owner": users[0],
    "availability": {
      "interval": ScheduleInterval.always,
      "start": 0,
      "end": 0,
      "includingDays": [],
      "exceptions": [],
      "timeRanges": [],
    }
  },
  {
    "id": 1,
    "adress": "Måndagsvägen 1, Sundsbruk",
    "description": "Praktisk parkering mitt i centrum, fråga mig ifall ni undrar något.",
    "stars": 1,
    "price": 3,
    "location": [
      62.43588663486685, 17.36385056211084
    ],
    "picture": "",
    "properties": {
      "size": SlotSize.medium,
    },
    "owner": users[users.length - 1],
    "availability": {
      "interval": ScheduleInterval.daily,
      "start": new Date('2023-09-09').getTime() / 1000,
      "end": new Date('2029-09-10').getTime() / 1000,
      "timeRanges": [
        {"fromTime": 6 * 60 * 60, "toTime": 8 * 60 * 60},
        {"fromTime": 16 * 60 * 60, "toTime": 21 * 60 * 60}
      ],
      "includingDays": [],
      "exceptions": [
        {"start": new Date('2023-10-14').getTime() / 1000, "stop": new Date('2023-11-10').getTime() / 1000}
      ]
    }
  }
];



import {gql} from '@apollo/client';

export const SET_CURRENT_USER_KEY = 'setCurrentUser';
export const GET_USERS_QL = () => gql`
{
  users {
    id
    name
    picture
    profileCreated
  }
}
`;
export const GET_CURRENT_USER_QL = () => gql`
query CurrentUser {
  currentUser {
    id
    name
    picture
    profileCreated
  }
}
`;

export const SET_CURRENT_USER_QL = () => gql`
  mutation ${SET_CURRENT_USER_KEY}($id: Int!) {
    ${SET_CURRENT_USER_KEY}(id: $id) @client
  }
`;


export interface User {
  name: string
  picture: string
  id: number
  profileCreated?: number
};



export const samples: Array<User> = [
  {
    "id": 123,
    "name": "John Doe",
    "picture": "",
    "profileCreated": 1696095376
  },
  {
    "id": 459,
    "picture": "",
    "name": "Manny the bear",
    "profileCreated": 1696095376
  },
  {
    "id": 456,
    "picture": "",
    "name": "Jane Doe",
    "profileCreated": 1696095376
  }
];

export const notLoggedinUser: User = {
  name: 'Ej inloggad',
  picture: '',
  id: -1,
  profileCreated: 0
};


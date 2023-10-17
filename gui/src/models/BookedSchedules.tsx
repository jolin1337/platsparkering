import {DocumentNode, gql} from '@apollo/client';
import {samples as allUsers} from './users';
import {samples as allSlots} from './slots';
import {Schedule, ScheduleInterval} from './schedule';

export interface BookedSchedule extends Schedule {
  id: number
  slotId: number
  slotOwnerId: number
  carOwnerId: number
};


export const GET_BOOKED_SCHEDULES = (filters?: Partial<BookedSchedule>): [DocumentNode, { variables: Partial<BookedSchedule> }] => {
  let filter = '';
  if (filters) {
    const k = Object.keys(filters).map(k => `${k}: $${k}`).join(',');
    filter = `(filter: {${k}})`;
  }
  return [
    gql`
      query booked_schedules {
        booked_schedules ${filter} {
          id
          slotId
          slotOwnerId
          carOwnerId
          interval
          includingDays
          timeRanges
          start
          end
        }
      }`,
    { variables: filters }
  ];
};


export const samples: Array<BookedSchedule> = [
  {
    "id": 500,
    "slotId": allSlots[1].id,
    "slotOwnerId": allUsers[0].id,
    "carOwnerId": allUsers[2].id,
    "interval": ScheduleInterval.weekly,
    "includingDays": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "exceptions": [],
    "timeRanges": [
      {"fromTime": 6 * 60 * 60, "toTime": 8 * 60 * 60}
    ],
    "start": new Date('2023-09-10 10:10:00').getTime() / 1000.0,
    "end": new Date('2999-09-10 10:10:00').getTime() / 1000.0
  }
];



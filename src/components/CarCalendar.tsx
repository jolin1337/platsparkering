import { useState } from "react";
import {CarOutlined} from '@ant-design/icons';
import { Calendar, Modal,  } from 'antd';
import TimeCalendar from './TimeCalendar';
import * as dayjs from 'dayjs';
import { BookedSchedule } from '../models/BookedSchedules';
import {ScheduleInterval} from '../models/schedule';


export interface CarCalendarProps {
  events: Array<BookedSchedule>
};
export default function CarCalendar(props: CarCalendarProps) {
  const {events} = props;
  const [timeRangeOpen, setTimeRangeOpen] = useState<dayjs.Dayjs>();
  const getActiveEvents = (value: dayjs.Dayjs, ignoreDate?: boolean, ignoreTime?: boolean) => {
    const activeEvents = events.filter(event => {
      const stop = (event.end || 0) * 1000;
      const start = (event.start || 0) * 1000;
      if (value.isBefore(start) || value.isAfter(stop)) return false;
      if (ignoreDate) return true;
      let includingDays = true;
      if (event.includingDays.length > 0) {
        if (event.interval === ScheduleInterval.monthly) {
          includingDays = event.includingDays.includes(value.get('date'));
        }
        if (event.interval === ScheduleInterval.weekly) {
          includingDays = event.includingDays.includes(value.get('day'));
        }
      }
      if (ignoreTime || event.timeRanges.length === 0) {
        return includingDays;
      }
      const timeOverlaps = event.timeRanges.filter(range => {
        return value.isBefore(value.set('millisecond', range.toTime * 1000)) && value.isAfter(value.set('millisecond', range.fromTime * 1000));
      });
      return timeOverlaps.length > 0 && includingDays;
    });
    return activeEvents;
  };

  const cellRender = (current: dayjs.Dayjs, info: {type: string}) => {
    const ignoreDate = info.type === 'month';
    const ignoreTime = true;
    const activeEvents = getActiveEvents(current, ignoreDate, ignoreTime);
    return (
      <ul className="events">
        {activeEvents.map((evt: any, i: number) => (
          <li key={i}>
            <CarOutlined style={{color: evt.color}} />
          </li>
        ))}
      </ul>
    );
  };
  return <>
    <CarOutlined style={{color: 'orange'}} /> - Schemalagd bokning av din parkeringsplats
    <CarOutlined style={{marginLeft: 15, color: 'blue'}} /> - Din bokning av annans parkeringsplats
    <Calendar cellRender={cellRender} onSelect={setTimeRangeOpen} />
    <Modal
      title={"Tidschema för " + timeRangeOpen?.format('YYYY-MM-DD')}
      open={!!timeRangeOpen}
      onOk={() => setTimeRangeOpen(null)}
      onCancel={() => setTimeRangeOpen(null)}
    >
      {timeRangeOpen && <TimeCalendar date={timeRangeOpen} events={getActiveEvents(timeRangeOpen, false, true)} />}
    </Modal>
  </>;
}



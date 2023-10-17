import {CarOutlined} from '@ant-design/icons';
import {Tag, Row, Col} from 'antd';
import * as dayjs from 'dayjs';
import {BookedSchedule} from '../models/BookedSchedules';

export interface TimeRangeProps {
  events: Array<BookedSchedule>
  date: dayjs.Dayjs
};

export default function TimeCalendar(props: TimeRangeProps) {
  const {events, date} = props;
  const cols = new Array(24).fill(null);
  const timeSlotStyle = {
    padding: 10,
  };
  const isTimeOverlaping = (event: BookedSchedule, hourStart: number, hourEnd: number) => {
    const overlaps = event.timeRanges.filter(range => {
      const rangeHourStart = date.set('millisecond', range.fromTime * 1000).hour();
      return (rangeHourStart >= hourStart && rangeHourStart < hourEnd);// || (hourStart === 0 );
    });
    return overlaps.length > 0;
  };
  const hourWidth = 50;
  return <div style={{overflow: 'auto'}}>
    <div style={{width: 24 * hourWidth}}>
      <Row>
        {cols.map((_, i) => <Col key={i} style={{borderRight: '1px solid lightgrey'}} span={cols.length / 24}>
          <div style={timeSlotStyle}>{i}</div>
          {events.filter((evt) => isTimeOverlaping(evt, i, i + 1)).map(event => {
            const tToS = (t) => `${Math.round(t / (60 * 60)).toString().padStart(2, '0')}:${(t % (60 * 60)).toString().padStart(2, '0')}`;
            const tToPx = (t, hour) => hourWidth * (t - hour * 60 * 60) / (60 * 60);
            return event.timeRanges.map((tr, i) => (
              <Tag key={i} style={{
                marginLeft: tToPx(tr.fromTime, i),
                width: tToPx(tr.toTime, i) - tToPx(tr.fromTime, i),
              }}>
                <CarOutlined /> {tToS(tr.fromTime)} - {tToS(tr.toTime)}
              </Tag>
            ));
          })}
        </Col>)}
      </Row>
    </div>
  </div>
}

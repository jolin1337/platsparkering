import {useEffect, useState} from 'react';
import {InfoCircleOutlined} from '@ant-design/icons';
import {weekdaysShort} from 'dayjs/locale/sv';
import * as dayjs from 'dayjs';
import {DatePicker, Divider, Tooltip, Select, Cascader, Button} from 'antd';
import {Schedule, ScheduleInterval, TimeInterval, DateInterval} from '../models/schedule';


interface ParkingTimingProps {
  onNext: (props: {availability: Schedule}) => void
  showContinue?: boolean
  value?: {availability?: Schedule}
};

const RepeatablePickerRange = ({defaultValue, onChange, ...dateProps}: {defaultValue: Array<Array<number>>, picker: "time" | "date", showTime?: boolean, onChange: (event: Array<Array<number>>) => void}) => {
  const [ranges, setRanges] = useState<Array<Array<number>>>(defaultValue || []);
  const newRange = (r: Array<Array<number>>) => {
    setRanges(r);
    onChange(r);
  };
  const getDatePickerValue = (seconds: number) => {
    if (dateProps.picker === 'time') {
      return dayjs(seconds * 1000);
    }
    return dayjs(seconds * 1000);
  }
  return <div style={{display: 'flex', rowGap: 16, flexDirection: 'column'}}>
    {ranges.map((field, i) => (
      <div key={i}>
        <DatePicker.RangePicker
          allowEmpty={[false, false]}
          defaultValue={[getDatePickerValue(field[0]), getDatePickerValue(field[1])]}
          onChange={(e) => {
            const newR = ranges.filter((_, j) => j !== i);
            if (e) {
              newR.splice(i, 0, [e[0].unix(), e[1].unix()]);
            }
            newRange(newR);
          }}
          {...dateProps}
        />
      </div>
    ))}
    <Button type="dashed" style={{background: 'white', color: 'darkgrey', width: '150px'}} onClick={() => newRange([...ranges, [null, null]])} block>
      + Lägg till tid
    </Button>
  </div>;
};

const ParkingTiming = ({showContinue, value, onNext}: ParkingTimingProps) => {
  const [interval, setInterval] = useState<ScheduleInterval>(ScheduleInterval.always);
  const [includingDays, setIncludingDays] = useState<Array<number>>([]);
  const [startStop, setStartStop] = useState<Array<dayjs.Dayjs>>([]);
  const [timeRanges, setTimeRanges] = useState<Array<TimeInterval>>([]);
  const [includingDaysAndWeeks, setIncludingDaysAndWeeks] = useState<Array<Array<number>>>([]);
  const [exceptions, setExceptions] = useState<Array<DateInterval>>([]);
  const weekDaysIds = weekdaysShort.map((_, i) => i);
  const weekdaysShortOptions = weekdaysShort.map((e, i) => ({value: i, label: e}));

  useEffect(() => {
    if (!value || !value.availability) return;
    setInterval(value.availability.interval);
    setIncludingDays(value.availability.includingDays);
    setStartStop([
      value.availability.start ? dayjs(value.availability.start * 1000) : null,
      value.availability.end ? dayjs(value.availability.end * 1000) : null
    ]);
    setTimeRanges(value.availability.timeRanges);
    setExceptions(value.availability.exceptions);
  }, [value]);
  const weekDays = <Select
    mode="multiple"
    style={{width: '100%'}}
    allowClear
    placeholder="Välj vilka veckodagar"
    value={includingDays}
    onChange={setIncludingDays}
    options={weekdaysShortOptions}
  />;
  const weekOptions = [
    {value: 0, label: 'Första veckan', children: weekdaysShortOptions},
    {value: 1, label: 'Andra veckan', children: weekdaysShortOptions},
    {value: 2, label: 'Tredje veckan', children: weekdaysShortOptions},
    {value: 3, label: 'Fjärde veckan', children: weekdaysShortOptions}
  ];
  const onWeekChange = (value: Array<Array<number>>) => {
    setIncludingDaysAndWeeks(value);
    setIncludingDays(value.map(g => {
      if (g.length === 1) {
        return weekDaysIds.map(d => d + g[0] * weekDaysIds.length)
      }
      return [g[1] + g[0] * weekDaysIds.length]
    }).flat());
  };
  const validateAndNext = () => {
    const availability = {
      interval,
      includingDays,
      exceptions,
      start: startStop[0] ? startStop[0].unix() : dayjs().unix(),
      end: startStop[1] ? startStop[1].unix() : 0,
      timeRanges,
    }
    onNext && onNext({availability});
  };
  const weeks = <Cascader
    multiple
    style={{width: '100%'}}
    placeholder="Välj vilka veckor"
    value={includingDaysAndWeeks}
    onChange={onWeekChange}
    options={weekOptions}
  />;
  const isSchedule = [ScheduleInterval.daily, ScheduleInterval.weekly, ScheduleInterval.monthly].includes(interval);
  return <>
    <Select value={interval} onChange={(e) => {onWeekChange(e === ScheduleInterval.monthly ? ([[0], [1], [2], [3]]) : e === ScheduleInterval.weekly ? weekDaysIds.map(d => [0, d]) : []); setInterval(e)}} options={[
      {value: ScheduleInterval.always, label: 'Alltid'},
      {value: ScheduleInterval.daily, label: 'Dagligen'},
      {value: ScheduleInterval.weekly, label: 'Veckovis'},
      {value: ScheduleInterval.monthly, label: 'Månadsvis'},
    ]}
      style={{width: '100%'}}
    />
    <Divider />
    {interval === ScheduleInterval.weekly && <>{weekDays}</>}
    {interval === ScheduleInterval.monthly && <>{weeks}</>}
    <Divider />
    {isSchedule && <h5>Tid på dygnet <Tooltip title="Ange en tid mellan 00:00 till 24:00 så kommer parkeringen schemaläggas denna tid varje dag du sagt att den ska vara tillgänglig"><InfoCircleOutlined /></Tooltip></h5>}
    {isSchedule && <>
      <RepeatablePickerRange
        defaultValue={timeRanges.map(tr => [tr.fromTime, tr.toTime])}
        picker="time"
        onChange={e => setTimeRanges(e.map(tr => ({fromTime: (tr[0]), toTime: (tr[1])})))}
      />
    </>}
    {isSchedule && <h5>Undantag till ovan angiven regel <Tooltip title="Ange eventuella Undantag för tillgängligheten av parkeringen."><InfoCircleOutlined /></Tooltip></h5>}
    {isSchedule && <>
      <RepeatablePickerRange
        defaultValue={exceptions.map(tr => [tr.start, tr.stop])}
        picker="date"
        showTime
        onChange={e => setExceptions(e.map(tr => ({start: tr[0], stop: tr[1]})))}
      />
    </>}
    <h5>Slutdatum för parkeringen <Tooltip title="Ange ett start och slutdatum då parkeringen skall finnas tillgänglig."><InfoCircleOutlined /></Tooltip></h5>
    <DatePicker.RangePicker allowEmpty={[false, true]} value={[startStop[0], startStop[1]]} onChange={setStartStop} />
    <Divider />
    {showContinue && <Button style={{float: 'right'}} onClick={validateAndNext}>Gå vidare</Button>}
  </>
};

export default ParkingTiming;
export {
  ParkingTimingProps,
  ParkingTiming,
};

import {SearchOutlined, CarOutlined} from '@ant-design/icons';
import {Radio, Slider, Input, DatePicker, Button, Form, Checkbox} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {History} from "../pages/SearchResult";
import * as dayjs from 'dayjs';

interface DetailedSearchProps {
  query: History
}
export default function DetailedSearch({query}: DetailedSearchProps) {
  const [form] = useForm();
  const initQuery: any = {...query};
  initQuery.range = [
    dayjs(query.fromDate),
    dayjs(query.toDate)
  ];
  const validateAndSearch = () => {

  };
  return <div>
    <Form form={form} layout="vertical" initialValues={initQuery}>
      <Form.Item<History>
        name="location"
        label="Plats, Adress eller ställe"
        rules={[{required: true, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Input onPressEnter={validateAndSearch} placeholder='Ange plats, adress eller ställe' size='large' />
      </Form.Item>
      <Form.Item
        name="range"
        label="Tid för parkering"
        rules={[{required: true, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <DatePicker.RangePicker size='large' showTime />
      </Form.Item>
      <Form.Item<History>
        name="expandKm"
        label="Utöka området med"
        rules={[{required: true, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Input type='number' suffix="km" onPressEnter={validateAndSearch} placeholder='0.0' size='large' />
      </Form.Item>

      <Form.Item<History>
        name="maxPrice"
        label="Max pris"
        rules={[{required: false, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Slider defaultValue={30} max={30} />
      </Form.Item>
      <h2>Andra egenskaper</h2>
      <Form.Item<History>
        name="fastCharge"
        rules={[{required: false, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Checkbox> Snabb laddare </Checkbox>
      </Form.Item>
      <Form.Item<History>
        name="charge"
        rules={[{required: false, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Checkbox> laddare </Checkbox>
      </Form.Item>
      <Form.Item<History>
        name="garage"
        rules={[{required: false, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Checkbox> Garage </Checkbox>
      </Form.Item>
      <Form.Item<History>
        name="size"
        label="Parkeringsstorlek"
        rules={[{required: false, message: 'Please input your username!'}]} style={{width: '100%'}}
      >
        <Radio.Group buttonStyle="solid" style={{height: 30}}>
          <Radio.Button style={{height: 30}} value="small"><CarOutlined style={{fontSize: '12pt'}} /></Radio.Button>
          <Radio.Button style={{height: 30}} value="medium"><CarOutlined style={{fontSize: '16pt'}} /></Radio.Button>
          <Radio.Button style={{height: 30}} value="large"><CarOutlined style={{fontSize: '18pt'}} /></Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Button onClick={validateAndSearch} style={{width: '100%'}} icon={<SearchOutlined />}></Button>
    </Form>
  </div>;
}

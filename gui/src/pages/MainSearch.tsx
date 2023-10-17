import {SearchOutlined} from '@ant-design/icons';
import {Space, Input, DatePicker, Button, Form} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {useNavigate} from 'react-router-dom';
import {addResult} from './SearchResult';
import {History} from './SearchResult';


function MainSearch() {
  const navigate = useNavigate();
  const [form] = useForm();
  async function validateAndSearch(evt: any) {
    try {
      const fields = await form.validateFields();
      addResult({
        location: fields.location,
        fromDate: fields.range[0].$d.getTime(),
        toDate: fields.range[1].$d.getTime(),
        result: null
      });
      navigate('/search');
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      margin: '-83px -50px 0 -50px',
      textAlign: 'center',
      paddingTop: 150,
      verticalAlign: 'middle',
      backgroundImage: `url(images/bg.png)`,
      backgroundSize: 'calc(max(100vw, 100vh))'
    }}>
      <h1 style={{
        margin: 50,
        textAlign: 'center',
        color: 'white',
        textShadow: '0 0 7px rgba(0,0,0,1)',
      }}>
        Platsparkering
      </h1>
      <Form form={form}>
        <Space.Compact>
          <Form.Item<History>
            name="location"
            rules={[{ required: true, message: 'Please input your username!' }]} style={{width: '100%'}}
          >
            <Input onPressEnter={validateAndSearch} placeholder='Ange plats, adress eller ställe' size='large' />
          </Form.Item>
          <Form.Item
            name="range"
            rules={[{ required: true, message: 'Please input your username!' }]} style={{width: '100%'}}
          >
            <DatePicker.RangePicker size='large' showTime/>
          </Form.Item>
          <Button onClick={validateAndSearch} size='large' type='primary' icon={<SearchOutlined />}></Button>
        </Space.Compact>
      </Form>
    </div>
  );
};

export default MainSearch;

import {CarOutlined, EnvironmentOutlined, DollarOutlined} from '@ant-design/icons';
import {Card, Button, Form, Layout, Image, DatePicker, Divider, Rate, Col, Row, Tooltip} from "antd";
import {useEffect, useState} from "react";
import * as dayjs from 'dayjs';
import {useQuery} from '@apollo/client';
import {useNavigate, useParams} from "react-router-dom";
import {loader, History, addResult} from "./SearchResult";
import { GET_SLOT_QL } from '../models/slots';


export default function ParkingInfo() {
  const [query, setQuery] = useState<History>();

  const navigate = useNavigate();
  const {id} = useParams();
  const {loading, error, data} = useQuery(...GET_SLOT_QL(parseInt(id)));
  const updateSearch = (newQueryParts: {fromDate?: number, toDate?: number}) => {
    const newQuery = {...query, ...newQueryParts};
    setQuery(newQuery);
    addResult(newQuery);
  };
  const componentStyles = {
    margin: 5,
    background: 'white',
    border: '1px solid darkgrey',
    borderRadius: 5,
  }
  useEffect(() => {
    loader()
      .then((history: Array<History>) => {
        return history && history[history.length - 1];
      })
      .then(setQuery);
  }, []);
  if (error) navigate('/error?message=' + error.message);
  if (loading || !query) return <div>Loading...</div>;
  const slot = data.slot;
  const owner = slot.owner;
  return <Layout>
    <span style={{cursor: 'pointer', color: 'blue'}} onClick={() => navigate('/search')}>&lt;- Din Sökning</span>
    <Layout hasSider>
      <Layout.Content style={{...componentStyles}}><Image src={slot.picture} /></Layout.Content>
      <Layout.Sider style={{...componentStyles, padding: 10}}>
        <Form>
          <h3>Varukorg</h3>
          <Form.Item label="F.o.m">
    <DatePicker showTime onChange={(e) => updateSearch({fromDate: e.toDate().getTime()})} disabledDate={(d) => d.toDate().getTime() > query.toDate} defaultValue={dayjs(query.fromDate)} />
          </Form.Item>
          <Form.Item label="T.o.m">
    <DatePicker showTime onChange={(e) => updateSearch({toDate: e.toDate().getTime()})} disabledDate={(d) => d.toDate().getTime() < query.toDate} defaultValue={dayjs(query.toDate)} />
          </Form.Item>
          <Divider />
          <Form.Item label="Period">
            {((query.toDate - query.fromDate) / (1000 * 60 * 60)).toFixed(2)} timmar x {slot.price} kr
          </Form.Item>
          <Form.Item label="Pris">
            {((query.toDate - query.fromDate) / (1000 * 60 * 60) * slot.price).toFixed((2))} kr
          </Form.Item>
          <div style={{textAlign: 'center', paddingBottom: 10}}><Button onClick={() => navigate(`/checkout/${id}`)}>Gå till kassan</Button></div>
        </Form>
      </Layout.Sider>
    </Layout>
    <Layout.Footer style={componentStyles}>
      <Card>
        <Card.Meta avatar={<img alt={owner.name} src={owner.picture} />} description={`Delas av ${owner.name}`} title={<Rate defaultValue={slot.stars} disabled={true} />} />
      </Card>
      <Divider />
      <Row>
        <Col span={8}><EnvironmentOutlined /> <Tooltip title={slot.adress}>{slot.adress}</Tooltip></Col>
        <Col span={8}><DollarOutlined /> <Tooltip title={`${slot.price} kr`}>{slot.price} kr</Tooltip></Col>
        <Col span={8}><CarOutlined style={{fontSize: `${['small', 'medium', 'large'].indexOf(slot.size) * 2 + 12}pt`}} /> <Tooltip title={`${slot.size}`}>{slot.size}</Tooltip></Col>
      </Row>
    </Layout.Footer>
  </Layout>;
}

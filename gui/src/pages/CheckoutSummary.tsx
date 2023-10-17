import {SearchOutlined, EnvironmentOutlined} from '@ant-design/icons';
import {Layout, Button, Image, Divider, Col, Row, Tooltip, Input, Radio, Space} from "antd";
import {useEffect, useState} from "react";
import * as dayjs from 'dayjs';
import {useQuery} from '@apollo/client';
import {useNavigate, useParams} from "react-router-dom";
import {loader, History} from "./SearchResult";
import {GET_SLOT_QL} from '../models/slots';


export default function ParkingInfo() {
  const [query, setQuery] = useState<History>();
  const [paymentMethod, setPaymentMethod] = useState('swish');

  const navigate = useNavigate();
  const {id} = useParams();
  const {loading, error, data} = useQuery(...GET_SLOT_QL(parseInt(id)));
  const componentStyles = {
    margin: 5,
    padding: '5px 25px 30px 25px',
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
  const totalPrice = ((query.toDate - query.fromDate) / (1000 * 60 * 60) * slot.price).toFixed((2));
  return <>
    <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => navigate('/search')}>&lt;- Din Sökning</span>
    <Layout style={componentStyles}>
    <h3>Hyrobjekt</h3>
    <Row gutter={20}>
      <Col span={8}> <Image src={slot.picture} /> </Col>
      <Col span={8}>
        <EnvironmentOutlined /> <Tooltip title={slot.adress}>{slot.adress}</Tooltip>
        <p>F.o.m:  {dayjs(query.fromDate).format('YYYY-MM-DD, HH:MM')}</p>
        <p>T.o.m:  {dayjs(query.toDate).format('YYYY-MM-DD, HH:MM')}</p>
        <hr />
        <p>Period: {((query.toDate - query.fromDate) / (1000 * 60 * 60)).toFixed(2)} timmar x {slot.price} kr</p>
        <p>Pris: {totalPrice} kr</p>
      </Col>
    </Row>
    <Divider />
    <Row gutter={20}>
      <Col span={12}>
        <h3>Fordonsuppgifter</h3>
        Registreringsnummer: <Input addonAfter={<SearchOutlined />} value="ABC 123" />
      </Col>
      <Col span={12}>
        <i>Skoda Fabia TSI</i>
        <p style={{color: 'grey'}}>En silver halvkombi av årsmodell 2013 som är i trafik. Växellådan är manuell och motorn är på 86 hk och drivs med bensin. Vid blandad körning förbrukar den 5,1 liter/100km. Vi uppskattar den årliga körsträckan till 2 267 mil.</p>
      </Col>
    </Row>
    <Divider />
    <Row gutter={20}>
      <Col span={12}>
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{float: 'right'}}>
          <Space direction="vertical">
            <Radio value="swish">Swish</Radio>
            <Radio value="card">Kortbetalning</Radio>
            <Radio value="paypal">Paypal</Radio>
            <Radio value="invoice">Klarna Faktura</Radio>
          </Space>
        </Radio.Group>
      </Col>
      <Col span={12}>
        <p>
          Telefonnummer
          <Input placeholder='+467X XXX XX XX' />
        </p>
        <Button>Betala {totalPrice}</Button>
      </Col>
    </Row>
    </Layout>
    </>;
}

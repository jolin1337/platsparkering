import {Layout, Row, Col, Divider} from "antd";
import {ArrowsAltOutlined, ShrinkOutlined} from '@ant-design/icons';
import {Popup, Marker, MapContainer, TileLayer, useMap} from "react-leaflet";
import {CSSProperties, useEffect, useState} from "react";
import ParkPreview from "../components/ParkPreview";
import {Slot, GET_SLOTS_QL} from "../models/slots";
import {useQuery} from '@apollo/client';
import DetailedSearch from "../singeltons/DetailedSearch";



const MapFitBounds = (props: {poi: Array<[number, number]>, height: number}) => {
  const {poi, height} = props;
  const map = useMap();
  useEffect(() => {
    map.fitBounds(poi, {padding: [10,10]});
  }, [map, poi]);
  useEffect(() => {
    map.getContainer().style.height = height + 'px';
    map.invalidateSize();
  })
  return null;
};



export interface Result {
  slots: Array<Slot>
};
export interface History {
  location: string,
  fromDate: number,
  toDate: number,
  expandKm?: number,
  maxPrice?: number,

  fastCharge?: boolean,
  charge?: boolean,
  garage?: boolean,
  size?: string,
  result?: Result
};
const historyLSKey = 'searchHistory';

export async function loader(): Promise<Array<History>> {
  const history: Array<History> = JSON.parse(window.localStorage.getItem(historyLSKey)) || [];
  return Promise.resolve(history);
}
export async function addResult(query: History) {
  const history: Array<History> = await loader();
  history.push(query);
  window.localStorage.setItem(historyLSKey, JSON.stringify(history));
}
export async function updateResultOfLastQuery(result) {
  const history: Array<History> = await loader();
  history[history.length - 1].result = result;
  window.localStorage.setItem(historyLSKey, JSON.stringify(history));
}
export async function clearResults(): Promise<Array<History>> {
  window.localStorage.setItem(historyLSKey, '[]');
  return Promise.resolve([]);
}

export default function SearchResult() {
  const [history, setHistory] = useState<Array<History>>([]);
  const [moreSettingsVisible, setMoreSettingsVisible] = useState<boolean>(true);
  const {loading, error, data} = useQuery(...GET_SLOTS_QL());
  const [zoomMap, setZoomMap] = useState<number>(0);
  useEffect(() => {
    loader()
      .then((history: Array<History>) => {
        const lastHistory: History = history[history.length - 1];
        if (lastHistory && !lastHistory.result) {
          //lastHistory.result = {};
        }
        return history;
      })
      .then(setHistory);
  }, []);
  const [location] = useState<{lat: number, lon: number}>();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const expandStyle: CSSProperties = {
    position: "absolute",
    right: 10,
    top: 10,
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(150,150,150,0.5)',
    borderRadius: 5,
    padding: 5,
    zIndex: 1000,
  };
  return <Layout style={{minHeight: '100vh'}}>
    <Layout.Content style={{padding: '0 15px 15px 15px'}}>
      <Row gutter={0} style={{position: 'relative'}}>
        {zoomMap === 0 && <ArrowsAltOutlined style={expandStyle} onClick={() => setZoomMap(1)} />}
        {zoomMap === 1 && <ShrinkOutlined style={expandStyle} onClick={() => setZoomMap(0)} />}
        <MapContainer center={location ? [location.lat, location.lon] : [62.445592, 17.351689]} zoom={13} scrollWheelZoom={true} style={{height: 300, width: '100%'}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFitBounds poi={data.slots.map(s => s.location)} height={300 + (window.innerHeight - 350) * zoomMap} />
          {data.slots.map(slot => (
            <Marker key={slot.id} position={slot.location}>
              <Popup>
            <ParkPreview slot={slot}/>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Row>
      <Divider />
      <Row gutter={16}>
        {data.slots.map((slot, idx) => (<Col key={idx} span={12}><ParkPreview slot={slot} /></Col>))}
      </Row>
    </Layout.Content>
    <Layout.Sider trigger={null} width="30%" style={{padding: 20}} collapsible collapsed={!moreSettingsVisible} onCollapse={(value) => setMoreSettingsVisible(value)}>
      {history.length > 0 && <DetailedSearch query={history[history.length - 1]} />}
    </Layout.Sider>
  </Layout>;
}

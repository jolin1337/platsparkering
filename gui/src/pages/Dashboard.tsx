import {EditOutlined, CalendarOutlined} from '@ant-design/icons';
import {Modal, Row, Col, Button, Tabs} from 'antd';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Slot, GET_MY_SLOTS_QL} from "../models/slots";
import {useQuery} from '@apollo/client';
import ParkPreview from '../components/ParkPreview';
import CarCalendar from '../components/CarCalendar';
import {GET_BOOKED_SCHEDULES, BookedSchedule} from '../models/BookedSchedules';



function Dashboard() {
  const navigate = useNavigate();
  const currentUser = parseInt(window.localStorage.getItem('currentUser'));
  const [myParkingModalOpen, setMyParkingModalOpen] = useState<Slot>();
  const [qSlots, qSlotOwner, qBookings] = [
    useQuery(...GET_MY_SLOTS_QL()),
    useQuery(...GET_BOOKED_SCHEDULES({slotOwnerId: currentUser})),
    useQuery(...GET_BOOKED_SCHEDULES({carOwnerId: currentUser})),
  ];
  if (qSlots.loading || qSlotOwner.loading || qBookings.loading) return <div>Loading...</div>;
  const errors = [qSlots, qSlotOwner, qBookings].filter(q => !!q.error);
  if (errors.length) {
    navigate('/error?err=' + errors[0].error.message);
    return <div>Error errors[0].error.message</div>;
  }
  const slots: Array<Slot> = qSlots.data.mySlots;
  const schedules: Array<BookedSchedule> = qSlotOwner.data.booked_schedules.map((s: BookedSchedule) => ({...s, color: 'orange'}));
  const bookings: Array<BookedSchedule> = qBookings.data.booked_schedules.map((b: BookedSchedule) => ({...b, color: 'blue'}));
  const tabStyle = {padding: 18, background: 'white'};
  const tabs = [
    {
      label: 'Mina parkeringar',
      key: '1',
      children: <div style={tabStyle}>
        <Button style={{float: 'right'}} onClick={() => navigate('/create-parking')}>Skapa annons</Button>
        <div style={{clear: 'both'}}>
          <Row gutter={18}>
            {slots.map((slot, i) => (<Col key={i} span={12}>
              <ParkPreview slot={slot} moreActions={[
                <EditOutlined onClick={() => navigate('/create-parking/' + slot.id)} />,
                <CalendarOutlined onClick={() => setMyParkingModalOpen(slot)} />
              ]} />
            </Col>))}
          </Row>
        </div>
      </div>
    },
    {
      label: 'Bokningar',
      key: '2',
      children: <div style={tabStyle}>
        <CarCalendar events={[...bookings, ...schedules]} />
      </div>
    }
  ]
  return (
    <div>
      <Tabs
        type="card"
        items={tabs}
      />
      <Modal
        title={myParkingModalOpen?.adress}
        width="90%"
        centered
        open={!!myParkingModalOpen}
        onOk={() => setMyParkingModalOpen(null)}
        onCancel={() => setMyParkingModalOpen(null)}
      >
        {myParkingModalOpen && <CarCalendar events={schedules.filter(schedule => schedule.slotId === myParkingModalOpen.id)} />}
      </Modal>
    </div>
  );
};

export default Dashboard;

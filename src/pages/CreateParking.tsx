import {InfoCircleOutlined} from '@ant-design/icons';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {Steps, Tooltip} from "antd";
import {useState, ReactNode, useEffect} from 'react';
import ParkingProperties from '../components/ParkProperties';
import ParkingPrice from '../components/ParkingPrice';
import ParkingTiming from '../components/ParkingTiming';
import ParkingLocation from '../components/ParkingLocation';
import ParkingVisuals from '../components/ParkingVisuals';
import {Slot, ADD_SLOT, GET_SLOT_QL} from '../models/slots';
import {useNavigate, useParams} from 'react-router-dom';
import {GET_CURRENT_USER_QL} from '../models/users';


export default function CreateParking() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [current, setCurrent] = useState<number>(0);
  const [querySelectedSlot, {loading, error, data}] = useLazyQuery(...GET_SLOT_QL(parseInt(id)));
  const {loading: userLoading, error: userError, data: userData} = useQuery(GET_CURRENT_USER_QL());
  const [slot, setSlot] = useState<Partial<Slot>>({
    owner: null,
    stars: 5,
  });
  const [addSlot] = useMutation(ADD_SLOT);
  useEffect(() => {
    if (parseInt(id) > 0) {
      querySelectedSlot({variables: {id: parseInt(id)}});
    }
  }, [id, querySelectedSlot]);
  useEffect(() => {
    if (!loading && !error && data) {
      setSlot(data.slot);
    }
  }, [data, loading, error]);
  useEffect(() => {
    if (userData?.currentUser) {
      setSlot({stars: 5, owner: userData.currentUser});
    }
  }, [userData]);
  const itemStyle = (i: number) => ({
    backgroundColor: 'white',
    borderRadius: 8,
    border: '1px solid lightgrey',
    marginBottom: 25,
    padding: 15,
    cursor: i >= current ? 'default' : 'pointer'
  });
  const renderStep = (i: number, component: ReactNode) => {
    if (i === current) return component;
    return <div>...</div>;
  };
  const onNext = (props) => {
    setSlot({...slot, ...props});
    setCurrent(current + 1);
  };
  const stepItems = [
    {
      title: 'Hur ser din parkeringsplats ut?',
      subTitle: <Tooltip title="Info" overlay="Här vill vi att du så noga som möjligt med hjälp av bilder och illustrationer identifierar vart man ska parkera"><InfoCircleOutlined /></Tooltip>,
      description: <ParkingVisuals onNext={onNext} />,
    },
    {
      title: 'Vart är din parkeringsplats?',
      subTitle: <Tooltip title="Info" overlay="Peka ut på kartan eller skriv in och verifiera exakta koordinater för vart parkeringen befinner sig."><InfoCircleOutlined /></Tooltip>,
      description: <ParkingLocation value={slot} onNext={onNext} />,
    },
    {
      subTitle: <Tooltip title="Info" overlay="Bestäm när du kan tänka dig att andra använder din parkering, exempelvis på helger, arbetstid eller andra repeterande mönster. Är det bara en engångsförteelse så skriv in vilka tider som gäller."><InfoCircleOutlined /></Tooltip>,
      title: 'När är din parkeringsplats tillgänglig för uthyrning?',
      description: <ParkingTiming showContinue value={slot} onNext={onNext} />,
    },
    {
      title: 'Vilket pris vill du hyra ut din parkering för?',
      subTitle: <Tooltip title="Info" overlay="Bestäm ett lämpligt pris utifrån läge, efterfrågan och din egen ekonomi. Vet du inte vilket pris som är lämpligt för din parkering kan du låta oss justera detta dynamiskt baserat på marknaden."><InfoCircleOutlined /></Tooltip>,
      description: <ParkingPrice showContinue showAutoPrice onNext={onNext} />,
    },
    {
      title: 'Finns det andra attraktiva egenskaper med parkeringen?',
      subTitle: <Tooltip title="Info" overlay="Ange ifall du har andra saker installerat på parkeringsplatsen som andra kan nyttja under deras parkeringstid, exempelvis finns det tak, laddare eller motorvärmare så är detta kvalifikationer som ökar attraktiviteten av din parkering."><InfoCircleOutlined /></Tooltip>,
      description: <ParkingProperties showConfirm onNext={(props) => {
        setSlot({...slot, ...props});
        addSlot({variables: {...slot, ...props, picture: slot['fileList'][0] || ""}}).then(v => console.log(v));//.catch(e => console.log(e));
      }} />,
    },
  ];
  if (loading || userLoading) return <div>Loading...</div>;
  if (error) navigate('/error?message=' + error.message);
  if (userError) navigate('/error?message=' + userError.message);
  return <><Steps
    current={current}
    direction="vertical"
    items={stepItems.map((item, i) => (
      {
        ...item,
        style: itemStyle(i),
        onClick: () => current > i && setCurrent(i),
        description: renderStep(i, item.description)
      }
    ))}
  />{JSON.stringify(slot)}</>;
}

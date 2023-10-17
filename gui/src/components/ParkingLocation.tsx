import {useEffect, useState} from "react";
import {Popup, Marker, useMapEvents, MapContainer, TileLayer} from "react-leaflet";
import {Input, Col, Row, Select, Divider, Button, Alert} from 'antd';

interface OpenStreetmapLocation {
  addresstype?: string
  boundingbox?: Array<string> // string numbers
  category?: string
  display_name?: string
  geojson?: {type: string, coordinates: Array<number>}
  importance: number
  lat: string // string number
  lon: string // string number
  name?: string
  osm_id: number
  osm_type?: string
  place_id?: number
  place_rank?: number
  type?: string // House/park/street....
  license?: string
};

interface ParkingLocationProps {
  onNext?: (props: {location: Array<number>, adress: string, description: string}) => void
  value: {location?: Array<number>, adress?: string, description?: string}
};


const MapParkInteraction = (props: {center: Array<number>, handleLookup: (option: OpenStreetmapLocation) => void}) => {
  const {center, handleLookup} = props;
  const map = useMapEvents({
    click: (event) => {
      _handleLookup(event.latlng.lat, event.latlng.lng);
    }
  });
  useEffect(() => {
    map.setView({lat: center[0], lng: center[1]});
  }, [center, map]);
  const _handleLookup = (lat: number, lon: number) => {
    const zoom = 18; // maxzoom 18 = Building, maxzoom 17 = minor street
    const url = `https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lon}&zoom=${zoom}&format=jsonv2`;
    fetch(url).then(data => data.json()).then(handleLookup)
  };
  return null;
};

const ParkingLocation = ({value, onNext}: ParkingLocationProps) => {
  const [suggestedLocations, setSuggestedLocations] = useState<Array<OpenStreetmapLocation>>(value && value.adress && value.location ? [{
    display_name: value.adress,
    lat: value.location[0].toString(),
    lon: value.location[1].toString(),
    importance: 1.0,
    osm_id: -1
  }] : []);
  const [location, setLocation] = useState<OpenStreetmapLocation>(suggestedLocations[0]);
  const [suggestionIsLoading, setSuggestionIsLoading] = useState(false);
  const [description, setDescription] = useState<string>(value?.description || '');
  console.log(description);
  const [isError, setIsError] = useState(false);
  const handleSearch = (searchString: string) => {
    setSuggestionIsLoading(true);
    const url = `https://nominatim.openstreetmap.org/search.php?q=${searchString}&polygon_geojson=0&format=jsonv2`;
    fetch(url).then(data => data.json()).then((options: Array<OpenStreetmapLocation>) => {
      setSuggestedLocations([...options, ...suggestedLocations.filter(loc => !options.find(oloc => oloc.osm_id === loc.osm_id))]);
    }).catch(() => setSuggestedLocations([])).finally(() => setSuggestionIsLoading(false));
  };
  const handleLookup = (option: OpenStreetmapLocation) => {
    if (!suggestedLocations.find(loc => loc.osm_id === option.osm_id)) {
      setSuggestedLocations([option, ...suggestedLocations]);
    }
    setLocation(option);
  };

  const handleChange = (value: any) => {
    const option = suggestedLocations.find(loc => loc.osm_id === value);
    setLocation(option);
  };
  const validateAndNext = () => {
    if (!location || !location.lat || !location.lon || !location.display_name) {
      setIsError(true);
      return
    }
    setIsError(false);
    onNext && onNext({
      location: [parseFloat(location.lat), parseFloat(location.lon)],
      adress: location.display_name,
      description
    })
  };
  return <Row gutter={20}>
    <Col span={14}>
      <Select
        showSearch
        value={location?.osm_id}
        loading={suggestionIsLoading}
        style={{maxWidth: '100%'}}
        placeholder="Ange plats eller adress där du äger din parkering"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        filterSort={(a, b) => 0 - a.label.toLowerCase().search(b.label.toLowerCase())}
        options={suggestedLocations.map((d) => ({
          value: d.osm_id,
          score: d.importance,
          label: d.display_name,
        }))}
      />
      <Divider orientationMargin={3} />
      <MapContainer center={location ? [location.lat, location.lon] : [62.445592, 17.351689]} zoom={13} scrollWheelZoom={true} style={{height: 300}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapParkInteraction center={location ? [parseFloat(location.lat), parseFloat(location.lon)] : [62.445592, 17.351689]} handleLookup={handleLookup} />
        <Marker position={location ? [parseFloat(location.lat), parseFloat(location.lon)] : [62.445592, 17.351689]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      {isError && <Alert description="Var vänlig ange en plats på kartan eller välj en plats genom att söka i sökrutan" />}
    </Col>
    <Col span={9}>
      <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beskriv din annons, exempelvis om din parkering är svår att hitta kan du beskriva hur man tar sig dit." style={{height: 300}} />
      <Divider orientationMargin={1} />
      <Button style={{float: 'right'}} onClick={validateAndNext}>Gå vidare</Button>
    </Col>
  </Row>;
};

export default ParkingLocation;

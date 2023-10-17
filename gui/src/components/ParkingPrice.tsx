import {useState} from "react";
import {InputNumber, Divider, Checkbox, Button} from "antd";

interface PriceProps {
  price: number,
  autoPrice: boolean
};
interface ParkingPriceProps {
  onNext: (props: PriceProps) => void
  showAutoPrice?: boolean
  showContinue?: boolean
};

const ParkingPrice = ({showAutoPrice, onNext, showContinue}: ParkingPriceProps) => {
  const [autoPrice, setAutoPrice] = useState<boolean>(showAutoPrice);
  const [price, setPrice] = useState<number>(2);
  const updatePrice = (price: number) => {
    setPrice(price);
    if (!showContinue) {
      onNext({price, autoPrice});
    }
  };
  const updateAutoPrice = (autoPrice: boolean) => {
    setAutoPrice(autoPrice);
    if (!showContinue) {
      onNext({price, autoPrice});
    }
  };
  return <>
    <InputNumber disabled={autoPrice} value={!autoPrice ? price : undefined} addonAfter="kr /timme" onChange={(e) => e && updatePrice(parseInt(e.toString()))} />
    <Divider orientation='right' />
    {showAutoPrice && <Checkbox checked={autoPrice} onChange={() => updateAutoPrice(!autoPrice)}>Låt oss avgöra pris automatisk baserat på marknadsvärdet</Checkbox>}
    {showContinue && <Button style={{float: 'right'}} onClick={() => onNext && onNext({price, autoPrice})}>Gå vidare</Button>}
  </>;
};

export default ParkingPrice;

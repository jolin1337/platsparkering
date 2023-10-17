import {useState} from 'react';
import {Button, Divider, Modal, Checkbox, Alert} from 'antd';
import {SlotProperties, SlotSize} from '../models/slots';


interface ParkingPropertiesProps {
  onNext: (props: {properties: SlotProperties}) => void
  showConfirm?: boolean
};

const ParkingProperties = ({onNext, showConfirm}: ParkingPropertiesProps) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userAgreement, setAcceptUserAgreement] = useState(false);
  const [responsibleAgreement, setAcceptResponsibleAgreement] = useState(false);
  const [properties, setProperties] = useState<SlotProperties>({size: SlotSize.medium, charge: false, fastCharge: false, garage: false});
  const [error, setError] = useState(null);
  const checkConfirmAndContinue = () => {
    if (!openConfirm && showConfirm) {
      setOpenConfirm(true);
      return;
    }
    if (!userAgreement || !responsibleAgreement) {
      setError(true);
      return;
    }
    setError(false);
    setOpenConfirm(false);
    onNext({properties});
  };
  return <>
    <Modal open={openConfirm} title="Platsparkerings vilkor för att hyra ut parkeringsplattser" onCancel={() => setOpenConfirm(false)} onOk={checkConfirmAndContinue}>
      <Checkbox onChange={(e) => {setAcceptUserAgreement(e.target.checked);}}>Jag har läst användar avtalen</Checkbox>
      <Divider />
      <Checkbox onChange={(e) => {setAcceptResponsibleAgreement(e.target.checked);}}>Jag accepterar att jag själv är ansvarig för informationen jag angivit är korrekt ifyllt.</Checkbox>
      {error && <Alert message="Du måste acceptera båda avtalen ovan för att fortsätta!" type="error" />}
    </Modal>
    <Checkbox onChange={(e) => {setProperties({...properties, charge: e.target.checked});}}>Laddare</Checkbox>
    <Checkbox onChange={(e) => {setProperties({...properties, fastCharge: e.target.checked});}}>Snabbladdare</Checkbox>
    <Checkbox onChange={(e) => {setProperties({...properties, garage: e.target.checked});}}>Garage</Checkbox>
    {showConfirm && <Button style={{float: 'right'}} onClick={checkConfirmAndContinue}>Skapa Parkering</Button>}
  </>
};

export default ParkingProperties;

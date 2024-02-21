import { useRef, useState, useEffect } from "react";
import {RcFile, UploadProps} from 'antd/es/upload';
import {PlusOutlined, FullscreenExitOutlined} from '@ant-design/icons';
import {UploadFile, Upload, Modal, Button} from 'antd';

const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = useState({x: null, y: null});
  useEffect(() => {
    const updateMousePosition = (ev: {clientX: number, clientY: number}) => {
      setMousePosition({x: ev.clientX, y: ev.clientY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


interface UploadParkingVisualization extends UploadFile {
  mark?: {x: number, y: number}
}

interface CreateParkingComponentProps {
  onNext?: (props: {fileList: Array<UploadParkingVisualization>}) => void
}

export default function ParkingVisuals({onNext}: CreateParkingComponentProps) {
  const previewImageRef = useRef<any>();
  const [markOffset, setMarkOffset] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [previewItem, setPreviewItem] = useState<UploadParkingVisualization>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(null);
  const [fileList, setFileList] = useState<Array<UploadParkingVisualization>>([]);
  const {x, y} = useMousePosition();

  const handleCancel = () => {
    setPreviewItem(null);
    setPreviewIndex(null);
  };

  const handlePreview = async (file: UploadParkingVisualization) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewItem(file);
    let idx = fileList.indexOf(file);
    if (idx < 0) idx = fileList.length - 1;
    setPreviewIndex(idx);
  };

  const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  useEffect(() => {
    console.log(previewImageRef);
    if (!previewImageRef.current) return;
    const offset = previewImageRef.current.getBoundingClientRect();
    setMarkOffset({x: offset.left, y: offset.top});
  }, [previewImageRef])
  return (
    <>
      <Upload
        action={(f: RcFile) => {handlePreview({originFileObj: f, uid: "-1", name: "upload"}); return 'upload'}}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {previewIndex}
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Button style={{float: 'right'}} onClick={() => onNext && onNext({fileList})}>Gå vidare</Button>
      <Modal open={!!previewItem} title='Markera exakt var på bilden du vill att man parkerar.' footer={null} onCancel={handleCancel} bodyStyle={{overflow: 'hidden'}}>
        <div>
          {previewItem && !previewItem.mark && <FullscreenExitOutlined style={{position: 'relative', left: x - markOffset.x - 15, top: y - markOffset.y + 15, fontSize: 30}} onClick={() => {previewItem.mark = {x: x - markOffset.x - 15, y: y - markOffset.y + 15};}} />}
          {previewItem?.mark && <FullscreenExitOutlined style={{position: 'relative', left: previewItem.mark.x - 15, top: previewItem.mark.y - 15, fontSize: 30}} />}
          <img ref={previewImageRef} alt="example" style={{width: '100%'}} src={previewItem?.url || (previewItem?.preview as string)} onClick={() => {previewItem.mark = {x: x - markOffset.x - 15, y: y - markOffset.y + 15};}} />

        </div>
      </Modal>
    </>
  );
}



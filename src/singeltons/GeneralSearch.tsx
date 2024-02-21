import {ConfigProvider, Input, Select, Tag, Space, InputRef, Tooltip, Button, Typography} from 'antd';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {useState, useRef, useEffect} from 'react';
import {History} from '../pages/SearchResult';

interface GeneralSearchProps {
  query: History,
  search?: (query: History) => void
};

interface QueryTag {
  value: string,
  label: string
}

const keyColors = {
  'fromDate': 'green',
  'toDate': 'green',
};
const friendlyKeys = {
  'toDate': 'Till datum',
  'fromDate': 'Från Datum',
};


function EditTagInput({handleInputConfirm, remainingTags, ...optionals}) {
  const [editInputValue, setEditInputValue] = useState(optionals.defaultTagValue || ':');
  const editInputRef = useRef<InputRef>(null);
  const handleEditSelect = (e: string) => {
    setEditInputValue(e + ':' + editInputValue.split(':', 2)[1]);
    editInputRef.current?.focus();
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(editInputValue.split(':', 2)[0] + ':' + e.target.value);
  };
  const validate = (evt) => {
    if (editInputRef.current?.input?.contains(evt.relatedTarget) || editInputValue === ':') return;
    handleInputConfirm({editInputValue});
  }
  return (<Space.Compact>
            <Select
              value={editInputValue.split(':')[0]}
              style={{minWidth: 70}}
              onSelect={e => handleEditSelect(e)}
              options={remainingTags}
              onBlur={validate}
              autoFocus
              size="small"
            />
            <Input
              ref={editInputRef}
              size="small"
              style={{}}
              value={editInputValue.split(':', 2)[1]}
              onChange={handleEditInputChange}
              onBlur={validate}
              onPressEnter={validate}
            />
          </Space.Compact>)
}


function QueryTagSearch({query}: GeneralSearchProps) {

  const [inputVisible, setInputVisible] = useState(false);
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const inputRef = useRef<InputRef>(null);


  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const valueToQueryTag = (value: string): QueryTag => {
    const [k, v] = value.split(':', 2);
    console.log(k, v);
    return {
      value,
      label: `${friendlyKeys[k]}:${convertValue(k, v)}`
    }
  };
  const convertValue = (k: string, value: any): string => {
    if (k.toLowerCase().includes('time') || k.toLowerCase().includes('date')) {
      const now = new Date();
      const date = new Date();
      date.setTime(value);
      if (now.toLocaleDateString() === date.toLocaleDateString()) {
        return `${date.toLocaleTimeString('sv-SE')}`;
      }

      return `${date.toLocaleString('sv-SE')}`;
    }
    return value;
  }
  const [tags, setTags] = useState<Array<QueryTag>>(Object.keys(query).filter(k => !!query[k] && !['result', 'location'].includes(k)).map(k => valueToQueryTag(`${k}:${query[k]}`)));

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = ({editInputValue}) => {
    if (editInputValue && !tags.map(tag => tag.value).includes(editInputValue)) {
      setTags([...tags, valueToQueryTag(editInputValue)]);
    }
    setInputVisible(false);
  };

  const handleEditInputConfirm = (evt) => {
    const {editInputValue} = evt;
    const newTags = [...tags];
    newTags[editInputIndex] = valueToQueryTag(editInputValue);
    setTags(newTags);
    setEditInputIndex(-1);
  };


  const handleClose = (removedTag: QueryTag) => {
    const newTags = tags.filter((tag) => tag.value !== removedTag.value);
    setTags(newTags);
  };
  const remainingTags = (
    Object.keys(friendlyKeys)
    .filter(k => !tags.find(t => t.value.startsWith(k)))
    .map(k => ({value: k, label: friendlyKeys[k]}))
  );
  return (
    <Space size={[0, 8]} wrap>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return <EditTagInput key={tag.value} remainingTags={remainingTags} defaultTagValue={tag.value} handleInputConfirm={handleEditInputConfirm}/>;
        }
        const isLongTag = tag.label.length > 20;
        const tagElem = (
          <Tag
            key={tag.value}
            closable={true}
            color={keyColors[tag.value.split(':')[0]]}
            style={{userSelect: 'none'}}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                setEditInputIndex(index);
                setInputVisible(false);
                e.preventDefault();
              }}
            >
              {isLongTag ? `${tag.label.slice(0, 20)}...` : tag.label}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip placement='bottom' title={tag.label} key={tag.value}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <EditTagInput remainingTags={remainingTags} handleInputConfirm={handleInputConfirm}/>
        
      ) : (
        <Tag style={{}} icon={<PlusOutlined />} onClick={showInput}>
          New Tag
        </Tag>
      )}
    </Space>);
};


export default function GeneralSearch({query, search}: GeneralSearchProps) {
  const [ellipsis, setEllipsis] = useState<boolean>(true);
  const [location, setLocation] = useState<string>(query.location);
  const [fromDate, setFromDate] = useState<number>(query.fromDate);
  const [toDate, setToDate] = useState<number>(query.toDate);
  return <Space.Compact>
    <Tooltip
      placement='top'
      color="white" 
      title={<div onClick={() => setEllipsis(!ellipsis)} 
      style={{color: 'orange', cursor: 'pointer'}}
    >{ellipsis ? "mer..." : "mindre"}</div>}>
      <Typography.Text style={{width: 635, height: 33, padding: '4px 10px', border: '1px solid #ccc', borderWidth: '1px 0px 1px 1px', borderRadius: '6px 0 0 6px'}} ellipsis={ellipsis}>
    <QueryTagSearch query={query} search={q => {setFromDate(q.fromDate); setToDate(q.toDate);}}/>
      </Typography.Text>
    </Tooltip>
    <Input value={location} placeholder="Plats" onChange={e => setLocation(e.currentTarget.value)}/>
    <Button onClick={() => search && search({location, fromDate, toDate})} type="primary"><SearchOutlined/></Button>
  </Space.Compact>;
}

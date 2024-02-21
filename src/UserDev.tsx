import {QuestionCircleOutlined} from '@ant-design/icons';
import {useQuery, useMutation} from '@apollo/client';
import {List, FloatButton, Modal} from 'antd';
import {useEffect, useState} from 'react';
import {User, GET_USERS_QL, GET_CURRENT_USER_QL, notLoggedinUser, SET_CURRENT_USER_QL} from './models/users';

export default function UserDev({navigate}) {
  const [openModal, setModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(notLoggedinUser);
  const {loading, error, data} = useQuery(GET_USERS_QL());
  const {loading: loadingUserData, error: errorUserData, data: userData} = useQuery(GET_CURRENT_USER_QL());
  const [changeUser] = useMutation(SET_CURRENT_USER_QL());
  const setUser = async (user: User) => {
    window.localStorage.setItem('currentUser', user.id.toString());
    setModalOpen(false);
    setCurrentUser(user);
    await changeUser({variables: {id: user.id}})
    navigate('/dashboard');
    //window.location.reload();
  }

  const users: Array<User> = [...(data?.users || []), notLoggedinUser];
  useEffect(() => {
    if (loadingUserData || errorUserData) return;
    //const userId = parseInt(window.localStorage.getItem('currentUser'));
    //const user = data?.users?.find(user => user.id === userId);
    const user = userData?.currentUser;
    if (user) {
      window.localStorage.setItem('currentUser', user.id.toString());
      setCurrentUser(user);
    }
  }, [userData, loadingUserData, errorUserData]);
  if (loading || error || users.length <= 1) return;
  return (<>
    <FloatButton icon={<QuestionCircleOutlined />} tooltip={<>{currentUser?.name} ({currentUser?.id})</>} onClick={() => setModalOpen(true)} />
    <Modal open={openModal} onCancel={() => setModalOpen(false)} footer={<></>} title="Välj användare">
      <List dataSource={users} itemLayout="horizontal" renderItem={(user: User, index) => (
        <List.Item  onClick={() => setUser(user)} style={{padding: 13, cursor: 'pointer', background: user.id !== currentUser.id ? 'transparent' : 'rgba(100,100,100,0.2)'}}  key={index}>

          <List.Item.Meta avatar={user.picture} title={user.name} />
        </List.Item>
      )} />
      {error && <>Kan inte ladda användarna, Anledning: {error.message}</>}
      {loading && <>Laddar användarlistan</>}
    </Modal>
  </>)
}

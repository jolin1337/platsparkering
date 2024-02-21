import {Layout, Breadcrumb} from 'antd';
import Header from './singeltons/Header';
import {RouterProvider} from "react-router-dom";
import router from './router';
import {useEffect, useState} from 'react';
import UserDev from './UserDev';


function App() {
  const [title, setTitle] = useState<string>(null);
  const [mode, setMode] = useState<string>(null);
  const updateTitle = (title: string, mode: string) => {
    setTitle(title);
    setMode(mode);
    window.document.title = `${title} - Platsparkering`;
  };
  const getTitle = (state) => {
    const path = state.location.pathname;
    if (path.startsWith('/search')) {
      updateTitle('Hitta Plats', 'rent');
    } else if (path.startsWith('/checkout')) {
      updateTitle('Boka din plats', 'rent');
    } else if (path.startsWith('/slot')) {
      updateTitle('Parkerings information', 'rent');
    } else if (path.startsWith('/login')) {
      updateTitle('Logga in', 'rentout');
    } else if (path.startsWith('/dashboard')) {
      updateTitle('Min sida', 'rentout');
    } else if (path.startsWith('/create-profile')) {
      updateTitle('Skapa profil', 'rentout');
    } else if (path.startsWith('/create-parking')) {
      updateTitle('Skapa parkering', 'rentout');
    } else if (path.startsWith('/error')) {
      updateTitle('Error', 'rentout');
    } else {
      updateTitle('Hem', 'rent');
    }
  };
  router.subscribe(getTitle);
  useEffect(() => getTitle(router.state));
  return (
    <div className="App">
      <Layout>
        <Header mode={mode} navigate={router.navigate} />
        <Layout.Content style={{padding: '0 50px'}}>
          <Breadcrumb style={{margin: '16px 0'}} items={[
            {title: <span style={{cursor: 'pointer'}} onClick={() => router.navigate('/')}>Hem</span>},
            {title: <>{title}</>}
          ]}>
          </Breadcrumb>
          <RouterProvider router={router} />
        </Layout.Content>
        <Layout.Footer style={{textAlign: 'center'}}>
          Platsparkering ©2023 Created By Bitinnovation
          <UserDev navigate={router.navigate}/>
        </Layout.Footer>
      </Layout>
    </div>
  );
}

export default App;

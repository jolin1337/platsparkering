import {Layout, Row, Col, Select, Menu} from 'antd';

export default function Header({mode, navigate}) {
  const userId = parseInt(window.localStorage.getItem('currentUser'));
  return (
    <Layout.Header>
      <Row>
        <Col flex="auto">
          Jag vill <Select value={mode} onChange={(value) => navigate(value === 'rent' ? '/search' : '/dashboard')}>
            <Select.Option value="rent" selected>hyra</Select.Option>
            <Select.Option value="rentout">hyra ut</Select.Option>
          </Select>
        </Col>
        <Col>
          <Menu style={{minWidth: 170}}
            mode="horizontal"
            items={[
              {key: 'login', label: <span onClick={() => navigate('/dashboard')}>{userId > 0 ? 'Min Sida' : 'Logga in'}</span>},
              {key: 'profile', label: <span onClick={() => navigate('/profile')}>{userId > 0 ? 'Redigera profil' : 'Skapa profil'}</span>},
            ]}
          >
          </Menu>
        </Col>
      </Row>
    </Layout.Header>
  );
}

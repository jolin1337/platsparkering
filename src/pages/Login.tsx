import {Space, Input, Button, Form} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {useNavigate} from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [form] = useForm();
  async function validateAndSearch() {
    try {
      // const fields = await form.validateFields();
      // Todo verify login
      navigate('/dashboard');
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      margin: '-83px -50px 0 -50px',
      textAlign: 'center',
      paddingTop: 150,
      verticalAlign: 'middle',
      backgroundImage: `url(platsparkering/images/bg.png)`,
      backgroundSize: 'calc(max(100vw, 100vh))'
    }}>
      <h1 style={{
        margin: 50,
        textAlign: 'center',
        color: 'white',
        textShadow: '0 0 7px rgba(0,0,0,1)',
      }}>
        Logga in till dina platsparkeringar
      </h1>
      <Form form={form}>
        <Space.Compact>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vänligen skriv in din epost!' }]} style={{width: '100%'}}
          >
            <Input onPressEnter={validateAndSearch} placeholder='E-post' size='large' />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Ange ditt lösenord!' }]} style={{width: '100%'}}
          >
            <Input onPressEnter={validateAndSearch} placeholder='Lösenord' size='large' />
          </Form.Item>
          <Button onClick={validateAndSearch} size='large' type='primary'>Logga in</Button>
        </Space.Compact>
      </Form>
    </div>
  );
};

export default Login;

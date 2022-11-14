import {
    Button,
    Paper,
    TextInput,
    NavLink,
    Group,
    PasswordInput
  } from '@mantine/core'
  import {IconEyeCheck, IconEyeOff } from '@tabler/icons'
  import { useForm } from '@mantine/form';
  import axios from 'axios'
import { useNavigate } from 'react-router-dom';
  function Login() {
    const navigate = useNavigate();

    const form = useForm({
      initialValues: {email: '', password: ''},
  
      // functions will be used to validate values at corresponding key
      validate: {
        email: (value) => (/\S+@\S+\.\S+/.test(value) ? null : 'Invalid email'),
        password: (value) => (value.length < 8 ? 'Password must be 8 character long!' : null),
      },
    });
  
    const userLogin=async (user)=>{
      try{
      const res = await axios.post('http://localhost:3001/login', user)
      const token = res.data.token
      localStorage.setItem('access_token', token);
      navigate('/');
      }catch(err){
        console.log("Something went wrong!")
      }
    }
    return (
      <div className='auth-container'>
        <Paper className='auth-box' shadow='xs' p='xl'>
          <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Login</h2>
          <form onSubmit={form.onSubmit(userLogin)}>
  
            <TextInput
              withAsterisk
              label='Email'
              placeholder='username@abc.com'
              mb={'xs'}
              {...form.getInputProps('email')}
            />
  
            <PasswordInput
              label='Password'
              placeholder='Password'
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
              }
              {...form.getInputProps('password')}
            />
  
            <NavLink label="Forgot Passwrord?">
            </NavLink>
  
            <Group position='center' mt='md'>
              <Button type='submit'>Login</Button>
            </Group>
          </form>
        </Paper>
      </div>
    )
  }
  
  export default Login;
  
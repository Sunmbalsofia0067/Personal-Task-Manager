import {
  Button,
  Paper,
  TextInput,
  Checkbox,
  Group,
  PasswordInput
} from '@mantine/core'
import {useNavigate} from 'react-router-dom'
import { useForm } from '@mantine/form';
import axios from 'axios'
import { IconEyeCheck, IconEyeOff } from '@tabler/icons'

function SignUp () {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { firstName: '', lastName: '', email: '', password: '' , checkbox: false },

    // functions will be used to validate values at corresponding key
    validate: {
      firstName: (value) => (value.length < 4 ? 'First name must have at least 4 letters' : null),
      lastName: (value) => (value.length < 4 ? 'Last name must have at least 4 letters' : null),
      email: (value) => (/\S+@\S+\.\S+/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 8 ? 'Password must be 8 character long!' : null),
      checkbox: (value) => (value === false ? 'Please agree to privacy policy!' : null),
    },
  });

  const registerUser=async (user)=>{
    try{
      await axios.post('http://localhost:3001/signup', user)
      form.setValues({ firstName: '', lastName: '', email: '', password: '' })
      form.setFieldValue('checkbox', false);
      // Redirect to login page
      navigate('/login')
    }catch(err){
      console.log("Something went wrong!")
    }
  }

  return (
    <div className='auth-container'>
      <Paper className='auth-box' shadow='xs' p='xl'>
        <h2 style={{ marginTop: '0px', textAlign: 'center' }}> Sign Up</h2>
        <form onSubmit={form.onSubmit(registerUser)}>
          <TextInput
            withAsterisk
            label='First Name'
            placeholder='First Name'
            mb={'xs'}
            {...form.getInputProps('firstName')}
          />
          <TextInput
            withAsterisk
            label='Last Name'
            placeholder='Last Name'
            mb={'xs'}
            {...form.getInputProps('lastName')}
          />

          <TextInput
            withAsterisk
            label='Email'
            placeholder='your@email.com'
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

          <Checkbox
            mt='md'
            label='I agree to privacy policy'
            {...form.getInputProps('checkbox')}
          />

          <Group position='center' mt='md'>
            <Button type='submit'>Submit</Button>
          </Group>
        </form>
      </Paper>
    </div>
  )
}

export default SignUp

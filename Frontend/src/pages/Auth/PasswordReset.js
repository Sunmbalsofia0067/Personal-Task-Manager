import { Button, Paper, Group, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconEyeCheck, IconEyeOff } from '@tabler/icons'
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import FindEmail from './FindEmail'

function PasswordReset () {
const [query_params] = useSearchParams()
const navigate = useNavigate()
const reset_token = query_params.get('reset_token')

const resetPassword = async(inputData)=>{
  const {password, confirmPassword} = inputData


  if(password === confirmPassword){
    // API Call
    const passwordResetCall = await axios.patch('http://localhost:3001/resetPass', {password, reset_token})
    console.log(passwordResetCall)
    form.setValues({ password: '', confirmPassword: '' })
    navigate('/login')
  }
  else {
    alert("Password not matched!")
  }
}

const form = useForm({
  initialValues: {password: '', confirmPassword: ''},

  // functions will be used to validate values at corresponding key
  validate: {
    password: (value) => (value.length < 8 ? 'Password must be 8 character long!' : null),
    confirmPassword: (value) => (value.length < 8 ? 'Password must be 8 character long!' : null)
  },
});

  return (
    <div className='auth-container'>
      <Paper className='auth-box' shadow='xs' p='xl'>
        <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Reset Your Password</h2>
        <form onSubmit={form.onSubmit(resetPassword)}>
          <PasswordInput
            label='New Password'
            placeholder='Password'
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
            }
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label='Confirm Password'
            placeholder='Password'
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
            }
            {...form.getInputProps('confirmPassword')}
          />
          <Group position='center' mt='md'>
            <Button type='submit'>Confirm</Button>
          </Group>
        </form>
      </Paper>
    </div>
  )
}

export default PasswordReset

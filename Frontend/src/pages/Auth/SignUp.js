import {
  Button,
  Paper,
  TextInput,
  Checkbox,
  Group,
  PasswordInput
} from '@mantine/core'
import { IconEyeCheck, IconEyeOff } from '@tabler/icons'

function SignUp () {
  return (
    <div className='auth-container'>
      <Paper className='auth-box' shadow='xs' p='xl'>
        <h2 style={{ marginTop: '0px', textAlign: 'center' }}> Sign Up</h2>
        <form>
          <TextInput
            withAsterisk
            label='First Name'
            placeholder='First Name'
            mb={'xs'}
            //{...form.getInputProps('firstName')}
          />
          <TextInput
            withAsterisk
            label='Last Name'
            placeholder='Last Name'
            mb={'xs'}
            //{...form.getInputProps('lastName')}
          />

          <TextInput
            withAsterisk
            label='Email'
            placeholder='your@email.com'
            mb={'xs'}
            //{...form.getInputProps('email')}
          />

          <PasswordInput
            label='Password'
            placeholder='Password'
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
            }
          />

          <Checkbox
            mt='md'
            label='I agree to privacy policy'
            //{...form.getInputProps('termsOfService', { type: 'checkbox' })}
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

import { Button, Paper, Group, PasswordInput } from '@mantine/core'
import { IconEyeCheck, IconEyeOff } from '@tabler/icons'

function PasswordReset () {
  return (
    <div className='auth-container'>
      <Paper className='auth-box' shadow='xs' p='xl'>
        <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Reset Your Password</h2>
        <form>
          <PasswordInput
            label='New Password'
            placeholder='Password'
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
            }
          />

          <PasswordInput
            label='Confirm Password'
            placeholder='Password'
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
            }
          />

          <Group position='center' mt='md'>
            <Button type='submit'>Login</Button>
          </Group>
        </form>
      </Paper>
    </div>
  )
}

export default PasswordReset

import {
    Button,
    Paper,
    TextInput,
    NavLink,
    Group,
    PasswordInput
  } from '@mantine/core'
  import {IconEyeCheck, IconEyeOff } from '@tabler/icons'
  
  function Login() {
    return (
      <div className='auth-container'>
        <Paper className='auth-box' shadow='xs' p='xl'>
          <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Login</h2>
          <form>
  
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
  
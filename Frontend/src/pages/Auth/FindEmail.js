import {
    Button,
    Paper,
    TextInput,
    Group
  } from '@mantine/core'

function FindEmail() {
    return (  
        <div className='auth-container'>
        <Paper className='auth-box' shadow='xs' p='xl'>
          <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Find Your Email</h2>
          <p style={{ marginTop: '-10px', textAlign: 'center' }}>Enter Your Recovery Email</p>
          <form>
  
            <TextInput
              placeholder='your@email.com'
              mb={'xs'}
              //{...form.getInputProps('email')}
            /> 
            <Group position='center' mt='md'>
              <Button type='submit'>Send password reset link</Button>
            </Group>
          </form>
        </Paper>
      </div>
    );
}

export default FindEmail;
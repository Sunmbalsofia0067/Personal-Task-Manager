import {
    Button,
    Paper,
    TextInput,
    Group
  } from '@mantine/core'
import { useForm } from '@mantine/form';
import axios from 'axios';
// import { useState } from 'react';

function FindEmail() {
  // const [inputEmail, setInputEmail] = useState('')

  const form = useForm({
    initialValues: { email: ''},

    // functions will be used to validate values at corresponding key
    validate: {
      email: value => (/\S+@\S+\.\S+/.test(value) ? null : 'Invalid email')
    }
  })

  const sendResetPasswordLink = async({email}) =>{
    console.log(email)
    const sendLink = await axios.post('http://localhost:3001/users/sendpasslink', {email})
    form.setValues({ email: '' })
    console.log(sendLink)
  }
    return (  
        <div className='auth-container'>
        <Paper className='auth-box' shadow='xs' p='xl'>
          <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Find Your Email</h2>
          <p style={{ marginTop: '-10px', textAlign: 'center' }}>Enter Your Recovery Email</p>
          <form onSubmit={form.onSubmit(sendResetPasswordLink)}>
  
            <TextInput
              placeholder='your@email.com'
              mb={'xs'}
              {...form.getInputProps('email')}
            /> 
            <Group position='center' mt='md'>
              <Button type='submit' >Send password reset link</Button>
            </Group>
          </form>
        </Paper>
      </div>
    );
}

export default FindEmail;
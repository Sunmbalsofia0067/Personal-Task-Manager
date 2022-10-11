import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as routes from './constants/routePaths.js'
import './App.css'
import SignUp from './pages/SignUp/SignUp.js'
import Login from './pages/Login/Login.js'
import Homepage from './pages/Homepage/Homepage.js'

function App () {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={routes.homePage} element={<Homepage/>} />
            <Route path={routes.signUp} element={<SignUp />}/>
            <Route path={routes.login} element={<Login/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App

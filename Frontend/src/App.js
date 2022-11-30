import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as routes from './constants/routePaths.js'
import './App.css'
// import PasswordReset from './pages/SignUp/PasswordReset.js'
import SignUp from './pages/Auth/SignUp.js'
import Login from './pages/Auth/Login.js'
import FindEmail from './pages/Auth/FindEmail.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import Homepage from './pages/Homepage/Homepage.js'
import PasswordReset from './pages/Auth/PasswordReset.js'
import CheckAuth from './components/CheckAuth.js'

function App () {
  return (
      <BrowserRouter>
        <Routes>
        <Route path={routes.homePage} element={
          <ProtectedRoute>
            <Homepage/>
          </ProtectedRoute>
        } />
        <Route path={routes.signUp} element={
          <CheckAuth>
            <SignUp/>
          </CheckAuth>
        } />
        <Route path={routes.login} element={
          <CheckAuth>
            <Login/>
          </CheckAuth>
        } />
        <Route path={routes.findEmail}  element={
          <CheckAuth>
            <FindEmail/>
          </CheckAuth>
        } />
        <Route path={routes.resetPass} element={
          <CheckAuth>
            <PasswordReset/>
          </CheckAuth>
        } />
        </Routes>
      </BrowserRouter>
  )
}

export default App

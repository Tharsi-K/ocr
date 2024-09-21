import { BrowserRouter, Routes, Route }from 'react-router-dom';
import React from 'react'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import OCR from './OCR/ocrTamil';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
  <Header />
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/sign-in' element={<SignIn />} />
    <Route path='/sign-up' element={<SignUp />} />
    <Route path='/about' element={<About />} />
    <Route element={<PrivateRoute allowedRoles={['User', 'Admin']} />}>
      <Route path='/profile' element={<Profile />} />
    </Route>
    {/* Admin-only route */}
    <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
      <Route path='/admin' element={<AdminPanel />} />
    </Route>
    <Route path='/ocr' element={<OCR />} />
  </Routes>
</BrowserRouter>

  )
}

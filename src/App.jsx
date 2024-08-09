import { BrowserRouter, Routes, Route }from 'react-router-dom';
import React from 'react'
import Home from './psges/Home';
import SignIn from './psges/SignIn';
import SignUp from './psges/SignUp';
import About from './psges/about';
import Profile from './psges/Profile';
import OCR from './OCR/ocrTamil';
import Header from './components/Header';

export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/about' element={<About />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/ocr' element={<OCR />} />
    </Routes>
    </BrowserRouter>
  )
}

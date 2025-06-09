import React,{ useState } from 'react'
import Navbar from "./Navbar"

const navLinks = [
    {id:'home',label:'Home'},
    {id:'about',label:'About'},
    {id:'contact',label:'Contact'}
];


function App() {
  return (
    <Navbar navLinks={navLinks}/>
  )
}

export default App

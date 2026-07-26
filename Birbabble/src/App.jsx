import { useState } from 'react'
import { Outlet, Link } from "react-router"
import './App.css'

function App() {

  return (
    <div className='App'>
      {/* make it slightly transparent upon movement */}
      <div className='headerContainer'>
        <header>
          <div className='logo'>
            
          </div>
          <div className='buttons'>
            <Link className='headerButton' >
              Home
            </Link>
            <Link className='headerButton createButton' to='/create'>
              +Post
            </Link>
          </div>
        </header>
      </div>
      <div className='main'>
        <Outlet/>
      </div>
    </div>
  )
}

export default App

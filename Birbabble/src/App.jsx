import { useState } from 'react'
import { Outlet, Link } from "react-router"
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import './App.css'

function App() {
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 20) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      header.style.backdropFilter = "blur(12px)"
    } else {
      header.style.backgroundColor = "#4E9151";
      header.style.backdropFilter = "blur(8px)"
  }
});

  return (
      <div className='App'>
        {/* make it slightly transparent upon movement */}
        <div className='headerContainer'>
          <header>
            <div className='logo'>
              
            </div>
            <div className='buttons'>
              <Link className='headerButton' to='/' >
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

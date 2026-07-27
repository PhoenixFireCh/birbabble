import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Routes/Home.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Create from './Routes/Create.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}>
        <Route index element={<Home/>}/>
        <Route path='/create' element={<Create/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)

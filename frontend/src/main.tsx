import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import FilialiList from './pages/FilialiList.tsx'
import FilialeDetail from './pages/FilialeDetail.tsx'
import FilialeForm from './pages/FilialeForm.tsx'
import AutomezziList from './pages/AutomezziList.tsx'
import AutomezzoDetail from './pages/AutomezzoDetail.tsx'
import AutomezzoForm from './pages/AutomezzoForm.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="filiali" element={<FilialiList />} />
          <Route path="filiali/new" element={<FilialeForm />} />
          <Route path="filiali/:id" element={<FilialeDetail />} />
          <Route path="automezzi" element={<AutomezziList />} />
          <Route path="automezzi/new" element={<AutomezzoForm />} />
          <Route path="automezzi/:id" element={<AutomezzoDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Course from './pages/Course'
import MediaKit from "./pages/MediaKit";

export default function App(){
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mediakit" element={<MediaKit />} />
        <Route path="/kurs/:slug" element={<Course />} />
      </Routes>
      <Footer />
    </>
  )
}
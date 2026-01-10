import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
function App() {
  return (
    <Router> {/* Aici e zona de JSX (permite cod HTML direct in javascript)*/}
      {/* Routerul = BrowserRouter = monitorizeaza URL-ul din bara de adrese a browserului*/}
      <Routes> {/* Routes = un selector; se uita la URL si decide ce componenta trebuie afisata*/}
        <Route path="/" element={<h1>🚀 Welcome to the Future! 🌟✨</h1>}></Route> {/* Route = legatura dintre o cale si elementul vizual */}
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </Router>
  )
}
export default App //folosim export default pentru a semnala: „Acesta este produsul principal al acestui fisier”.
//App decide ce se afiseaza pe ecran prin intermediul rutei (Router)
//Toate celelalte componente (Login, Dashboard, Navbar) sunt „copiii” lui App

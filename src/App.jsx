import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom"
import './App.css'
import Login from "./Admin/Login"
import Home from "./Admin/Home"
import SideBarLayout from "./Admin/Sidebar/SideBarLayout"
import Setting from "./Admin/Setting"
import Emaployees from "./Admin/Emaployees"
import SingaleEmployee from './Admin/SingaleEmployee/SingaleEmployee'
import ProtectedRoute from './Admin/RouteProtect/PrivateRoute';
import LeavePage from "./Admin/Leave/LeavePage"
import TicketManagement from "./Admin/Ticket/TicketManagement"
import VacancyHomePage from "./Admin/Vacancy/VacancyHomePage"
import Responses from "./Admin/Vacancy/Responses"
import OrganizationManagement from "./Admin/Department/OrganizationManagement"
function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route element={ <ProtectedRoute> <SideBarLayout/> </ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
        <Route path="/employee" element={<Emaployees/>} />
        <Route path="/employee/:id" element={<SingaleEmployee/>} />
        <Route path="/department" element={<OrganizationManagement />} />
        <Route path="/leave" element={<LeavePage />} /> 
        <Route path="/ticket" element={<TicketManagement />} />
        <Route path="/vacancy" element={<VacancyHomePage />}/>
        <Route path="/vacancy/response" element={<Responses />} />
        <Route path="/setting" element={<Setting/>} />
        </Route>
     </Routes>
    </BrowserRouter>
  )
}

export default App

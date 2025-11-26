import { useState } from 'react';
import { IoMenu, IoClose, IoHome, IoPeople, IoSettings, IoLogOut } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FaCalendar, FaTicket } from "react-icons/fa6";
import { RiBuilding2Fill } from "react-icons/ri";
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from "../Toast/ToastProvider";

const Sidebar = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem('adminToken');

   const response = await fetch('http://localhost:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.message}`);
    }
    localStorage.removeItem('adminToken');
    navigate('/'); 
    showToast("Logged out successfully", "success");    
  } catch (error) {
    console.error(error);
    showToast("Logout failed: " + error, "error");
    localStorage.removeItem('adminToken');
    navigate('/');     
  }
};

  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-400 to-pink-300 border-b border-purple-600 flex justify-between items-center px-4 py-3 shadow lg:hidden">
        <div className="text-lg font-bold text-white">Admin Panel</div>
        <button onClick={toggleSidebar} className="text-white"> 
          {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>

      <div
        className={`
          fixed top-0 left-0 z-50 h-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-100 text-gray-800 transform transition-transform duration-300 ease-in-out
          w-72 px-4 py-6
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:transform-none
        `}
      >
        <div className="mb-6 pb-3 border-b border-purple-400 flex items-center justify-between">
          <div className="text-2xl font-bold text-purple-700">Admin Panel</div>
          <button className="lg:hidden text-gray-700" onClick={toggleSidebar}>
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-100px)]">
          <nav className="space-y-3">
            <NavLink
  to="/home"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <IoHome /> Dashboard
</NavLink>

<NavLink
  to="/employee"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <IoPeople /> Employees
</NavLink>

<NavLink
  to="/department"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <RiBuilding2Fill /> Department
</NavLink>

<NavLink
  to="/leave"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <FaCalendar /> Leave
</NavLink>
<NavLink
  to="/ticket"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <FaTicket /> Ticket
</NavLink>
<NavLink
  to="/vacancy"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <FaUserPlus /> Posted Jobs
</NavLink>
<NavLink
  to="/setting"
  className={({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
    ${isActive ? "bg-purple-100 text-purple-800" : "hover:bg-purple-100"}`
  }
>
  <IoSettings /> Settings
</NavLink>
          </nav>
          <div className="border-t border-purple-300 mt-4 pt-4">
            <NavLink
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 mb-2 rounded-lg hover:bg-red-100 text-red-500 font-medium transition"
            >
              <IoLogOut /> Logout
            </NavLink>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;

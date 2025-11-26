import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';

const SideBarLayout = () => {
  return (
     <div className="flex h-screen overflow-hidden">
        <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 ">
        <div className="pt-13 lg:pt-0 min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SideBarLayout;

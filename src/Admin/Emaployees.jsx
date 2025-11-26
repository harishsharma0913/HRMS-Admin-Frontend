import { useEffect, useState } from "react";
import { FaPlus } from 'react-icons/fa';
import AddEmployee from "./AddEmployee"; 
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();


  const fectchData = () =>{ 
     fetch("http://localhost:5000/employee")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
        setLoading(false);
      });
    }
      useEffect(() => {
        fectchData();
  }, [refresh]);

  if (loading) {
    return <div className="text-center mt-10 text-lg text-purple-600 animate-pulse">Loading...</div>;
  }

  return (
    <div>
       <div className=" hidden md:flex items-center justify-between border-b p-4">
            <div>
              <h1 className="text-2xl text-purple-600">Employee Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right font-bold">
                <p className="text-sm">Admin User</p>
                <p className="text-xs text-muted-foreground">HR Department</p>
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                A
              </div>
            </div>
       </div>

    <div className="bg-pink-50 h-screen p-6">     

      {showModal && <AddEmployee onClose={() =>{ 
        setShowModal(false) 
         setRefresh(prev => !prev)} 
       } />}
      
      {employees.filter(emp => emp.status === true).length === 0 ? (
  <div className="text-center text-3xl text-red-500 mt-10">
    Employees are not exists....
  </div>
) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {employees
        .filter(emp => emp.status === true)
        .map((emp, index) => (
          console.log(emp.status),
          <div
            key={emp.id}
            onClick={() => navigate(`/employee/${emp._id}`)}
            className="bg-white rounded-2xl shadow-lg p-6 text-center space-y-3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
           <img
              src={
               emp?.documents?.profileImage
               ? `http://localhost:5000/uploads/${emp.documents.profileImage}`
               : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrmvSoqEMvs4E-TIgyfMdztZYEdKav-zok1A&s'
               }
              alt={emp.fullName}
               className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-300"
          />
            <h2 className="text-lg font-semibold text-purple-700">{emp.fullName}</h2>
            <p className="text-gray-600">{emp.personalEmail}</p>
            <p className="text-sm text-white bg-gradient-to-r from-purple-400 to-pink-400 inline-block px-3 py-1 rounded-full shadow">
              {emp.designation.name || "Fresher"}
            </p>
          </div>
        ))}
      </div>
)}
      <button
  onClick={() => setShowModal(true)}
  className="fixed bottom-6 right-6 cursor-pointer flex items-center gap-2 bg-pink-500 
             hover:bg-pink-600 text-white font-semibold py-3 px-5 rounded-2xl 
             shadow-lg transition-all duration-300 transform 
             hover:scale-110 hover:shadow-2xl animate-bounce-slow"
>
  <FaPlus className="w-5 h-5 animate-spin-slow" />
  Add Employee
</button>

    </div>
    </div>
  );
};

export default Employees;

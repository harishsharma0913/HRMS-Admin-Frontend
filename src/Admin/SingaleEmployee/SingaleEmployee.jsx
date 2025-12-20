import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdateEmployee from "../UpdateEmployee/UpdateEmployee";
import PasswordModal from "../PasswordUpdate/PasswordUpdate";
import { useToast } from "../Toast/ToastProvider";

const SingleEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadKey, setUploadKey] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

   const fetchEmployee = async () => {
      try {
        const res = await fetch(`https://hrms-api.tipsg.in/employee/${id}`);
        const result = await res.json();
        console.log("Employee data:", result);
        
        if (result.status) setEmployee(result.data);
        else console.error("Failed to fetch:", result.message);
      } catch (err) {
        console.error("Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleFileChange = (e, key) => {
  setSelectedFile(e.target.files[0]);
  setUploadKey(key);
  };

  const handleFinalSubmit = async () => {
    if (!selectedFile || !uploadKey) {
      showToast("Please select file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("key", uploadKey);

    try {
      setUploading(true);

      const res = await fetch(
        `https://hrms-api.tipsg.in/upload-document/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok) {
        showToast("Document uploaded successfully", "success");
        setSelectedFile(null);
        setUploadKey("");
        fetchEmployee(); // 🔥 refresh data
      } else {
        showToast(result.message || "Upload failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error", "error");
    } finally {
      setUploading(false);
    }
  };


  if (loading) {
    return (
      <div className="text-center mt-16 text-lg text-purple-600 animate-pulse">
        Loading employee details...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center mt-16 text-red-600 font-semibold">
        Employee not found.
      </div>
    );
  }

  
const handleUpdateEmployee = () => {
  setShowUpdate(true);
};

const handleCloseUpdate = () => {
  setShowUpdate(false);
};

const handleDeleteEmployee = async () => {
  try {
    const res = await fetch(`https://hrms-api.tipsg.in/employee/delete/${id}`, {
      method: "PATCH",
    });

    const result = await res.json();

    if (result.status) {
      setEmployee(prev => ({ ...prev, status: false }));
      navigate("/employee");
    } else {
      alert("Failed to delete employee.");
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("An error occurred.");
  }
};

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl p-10 animate-fade-in-down">
        {/* Header */}
<div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-6 mb-6">
  {/* Left: Profile Image and Info */}
  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
    <div className="flex-shrink-0">
      <img
        src={
          employee?.documents?.profileImage
            ? `https://hrms-api.tipsg.in/uploads/${employee.documents.profileImage}`
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrmvSoqEMvs4E-TIgyfMdztZYEdKav-zok1A&s"
        }
        alt={employee.fullName}
        className="w-36 h-36 rounded-full border-8 border-purple-300 shadow-lg object-cover"
      />
    </div>
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-4xl font-extrabold text-purple-700">{employee.fullName}</h1>
      <p className="mt-2 text-gray-500 font-bold text-lg">{employee.personalEmail}</p>
      <p className="mt-3 text-sm inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-1 rounded-full font-semibold shadow-lg select-none">
        {employee.designation?.name || "Fresher"} - {employee.designation?.department?.name || "No Department"}
      </p>
    </div>
  </div>

   {/* Right: Buttons */}
   <div className="flex flex-col items-center md:items-end gap-2">
  <button
    onClick={handleUpdateEmployee}
    className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow hover:shadow-md hover:scale-105 active:scale-95 transition"
  >
    Update
  </button>

  <button
    onClick={() => setShowPasswordModal(true)}
    className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow hover:shadow-md hover:scale-105 active:scale-95 transition"
  >
    Change Password
  </button>
</div>
</div>
        {/* Info Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
          {/* Contact */}
          <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-200">
            <h2 className="text-xl font-bold mb-4 text-purple-700 border-b border-purple-300 pb-2">
              Contact Details
            </h2>
            <p className="mb-3">
              <span className="font-semibold text-purple-600">Official Email:</span> {employee.officialEmail}
            </p>
            <p className="mb-3">
              <span className="font-semibold text-purple-600">Phone Number:</span> {employee.phoneNo}
            </p>
             <p className="break-words whitespace-pre-line max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
              <span className="font-semibold text-purple-600">Address:</span> {employee.address}
            </p>
          </div>

          {/* Professional */}
          <div className="bg-pink-50 p-6 rounded-xl shadow-md border border-pink-200">
            <h2 className="text-xl font-bold mb-4 text-pink-600 border-b border-pink-300 pb-2">
              Professional Details
            </h2>
            
              <p className="mb-3">
              <span className="font-semibold text-pink-600">Date of Birth:</span> {new Date(employee.dob).toLocaleDateString()}
            </p>
            <p className="mb-3">
              <span className="font-semibold text-pink-600">Blood Group:</span> {employee.bloodGroup}
            </p>
            <p className="mb-3">
              <span className="font-semibold text-pink-600">Date of Joining:</span> {new Date(employee.doj).toLocaleDateString()}
            </p>
            <p className="mb-3">
              <span className="font-semibold text-pink-600">IsActive:</span> {employee.isActive}
            </p>
            {/* <p>
              <span className="font-semibold text-pink-600">Password:</span> {employee.password}
            </p> */}
          </div>
        </div>

        {/* Experience */}
        {employee.experience?.length > 0 && (
          <div className="mt-10 bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-blue-600 border-b border-blue-300 pb-2">Experience</h2>
            <div className="space-y-4">
              {employee.experience.map((exp, i) => (
                <div key={i} className="border-l-4 border-blue-400 pl-4">
                  <p><span className="font-semibold">Company Name:</span> {exp.companyName || "Null"} </p>
                  <p><span className="font-semibold">Designation:</span> {exp.designation_1 || "Null"}</p>
                  <p>
                    <span className="font-semibold">From:</span>{" "}
                    {exp.from ? new Date(exp.from).toLocaleDateString("en-IN") : "Null"}</p>
                   <p><span className="font-semibold">To:</span>{" "}
                     {exp.to ? new Date(exp.to).toLocaleDateString("en-IN") : "Null"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="mt-10 bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200">
  <h2 className="text-xl font-bold text-yellow-800 mb-4 border-b border-yellow-400 pb-2">
    Documents
  </h2>
  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
    {/* Aadhaar */}
    <li>
      <span className="font-medium text-gray-800">Aadhaar Card:</span>{" "}
      {employee.documents?.aadhar ? (
        <a
          href={`https://hrms-api.tipsg.in/uploads/${employee.documents.aadhar}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <div className="flex items-center gap-3 mt-2">
          {/* File Input */}
          <input
            type="file"
            accept="image/*,.pdf"
            className="block bg-white rounded-sm text-sm text-gray-600
              file:m-1 file:px-2 
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              cursor-pointer"
             onChange={(e) => handleFileChange(e, "aadhar")}      />

          {/* Upload Button */}
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-1 text-sm font-semibold
              bg-green-500 text-white
              rounded-md shadow
              hover:bg-green-600
              active:scale-95 transition"
          >
            Upload
          </button>
        </div>
        )}
    </li>

    {/* PAN */}
    <li>
      <span className="font-medium text-gray-800">Pan Card:</span>{" "}
      {employee.documents?.pan ? (
        <a
          href={`https://hrms-api.tipsg.in/uploads/${employee.documents.pan}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <div className="flex items-center gap-3 mt-2">
          {/* File Input */}
          <input
            type="file"
            accept="image/*,.pdf"
            className="block bg-white rounded-sm text-sm text-gray-600
              file:m-1 file:px-2 
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              cursor-pointer"
            onChange={(e) => handleFileChange(e, "pan")}
          />

          {/* Upload Button */}
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-1 text-sm font-semibold
              bg-green-500 text-white
              rounded-md shadow
              hover:bg-green-600
              active:scale-95 transition"
          >
            Upload
          </button>
        </div>
      )}
    </li>

    {/* Mark Sheets (10th, 12th, UG, PG) */}
    <li className="text-yellow-800 font-medium mt-3">Mark Sheets:</li>
    <ul className="pl-6 list-disc text-sm space-y-1">
      <li>
        <span className="font-medium text-gray-800">10th:</span>{" "}
        {employee.documents?.marksheets?.ten ? (
          <a
            href={`https://hrms-api.tipsg.in/uploads/${employee.documents.marksheets.ten}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
        <div className="flex items-center gap-3 mt-2">
          {/* File Input */}
          <input
            type="file"
            accept="image/*,.pdf"
            className="block bg-white rounded-sm text-sm text-gray-600
              file:m-1 file:px-2 
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              cursor-pointer"
            onChange={(e) => handleFileChange(e, "marksheets.ten")}
          />

          {/* Upload Button */}
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-1 text-sm font-semibold
              bg-green-500 text-white
              rounded-md shadow
              hover:bg-green-600
              active:scale-95 transition"
          >
            Upload
          </button>
        </div>
        )}
      </li>
      <li>
        <span className="font-medium text-gray-800">12th:</span>{" "}
        {employee.documents?.marksheets?.twel ? (
          <a
            href={`https://hrms-api.tipsg.in/uploads/${employee.documents.marksheets.twel}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
        <div className="flex items-center gap-3 mt-2">
          {/* File Input */}
          <input
            type="file"
            accept="image/*,.pdf"
            className="block bg-white rounded-sm text-sm text-gray-600
              file:m-1 file:px-2 
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              cursor-pointer"
              onChange={(e) => handleFileChange(e, "marksheets.twel")}
          />

          {/* Upload Button */}
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-1 text-sm font-semibold
              bg-green-500 text-white
              rounded-md shadow
              hover:bg-green-600
              active:scale-95 transition"
          >
            Upload
          </button>
        </div>
        )}
      </li>
    </ul>
    {/* Higher Education (UG, PG) */}
      <li className="text-yellow-800 font-medium mt-3">Higher Education:</li>
      <ul className="pl-6 list-disc text-sm space-y-1">
      <li>
        <span className="font-medium text-gray-800">UG:</span>{" "}
        {employee.documents?.marksheets?.ug ? (
          <a
            href={`https://hrms-api.tipsg.in/uploads/${employee.documents.marksheets.ug}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
        <div className="flex items-center gap-3 mt-2">
          {/* File Input */}
          <input
            type="file"
            accept="image/*,.pdf"
            className="block bg-white rounded-sm text-sm text-gray-600
              file:m-1 file:px-2 
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              cursor-pointer"
            onChange={(e) => handleFileChange(e, "marksheets.ug")}
          />

          {/* Upload Button */}
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-1 text-sm font-semibold
              bg-green-500 text-white
              rounded-md shadow
              hover:bg-green-600
              active:scale-95 transition"
          >
            Upload
          </button>
        </div>
        )}
      </li>
      <li>
        <span className="font-medium text-gray-800">PG:</span>{" "}
        {employee.documents?.marksheets?.pg ? (
          <a
            href={`https://hrms-api.tipsg.in/uploads/${employee.documents.marksheets.pg}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
        <div className="flex items-center gap-3 mt-2">
          {/* File Input */}
          <input
            type="file"
            accept="image/*,.pdf"
            className="block bg-white rounded-sm text-sm text-gray-600
              file:m-1 file:px-2 
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              cursor-pointer"
            onChange={(e) => handleFileChange(e, "marksheets.pg")}
          />

          {/* Upload Button */}
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-1 text-sm font-semibold
              bg-green-500 text-white
              rounded-md shadow
              hover:bg-green-600
              active:scale-95 transition"
          >
            Upload
          </button>
        </div>
        )}
      </li>
    </ul>
  </ul>
</div>
        {/* Bank Details */}
        {employee.bankDetails && (
          <div className="mt-10 bg-green-50 p-6 rounded-xl shadow-md border border-green-200">
            <h2 className="text-xl font-bold mb-4 text-green-600 border-b border-green-300 pb-2">Bank Details</h2>
            <p><span className="font-semibold">Bank Name:</span> {employee.bankDetails.bankName}</p>
            <p><span className="font-semibold">Account Number:</span> {employee.bankDetails.accountNumber}</p>
            <p><span className="font-semibold">IFSC Code:</span> {employee.bankDetails.ifscCode}</p>
            <p><span className="font-semibold">Branch Name:</span> {employee.bankDetails.branchName}</p>
          </div>
        )}
      
      {/* Delete Button at the Bottom */}
<div className="mt-12 flex justify-end">
  <button
    onClick={handleDeleteEmployee}
    className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:shadow-lg hover:scale-105 active:scale-95 transition"
  >
    Delete Employee
  </button>
</div>


      </div>

      {showUpdate && (
      <UpdateEmployee
        employee={employee}
        onClose={handleCloseUpdate}
        onUpdate={() => {
         fetchEmployee();
        handleCloseUpdate();
        }}
      />
     )}

       <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        employeeId={employee._id}
        onPasswordUpdated={() => console.log("Password changed")}
      />

    </div>
  );
};

export default SingleEmployee;

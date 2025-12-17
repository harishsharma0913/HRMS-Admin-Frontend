import { useEffect, useState } from "react";
import { useToast } from "../Toast/ToastProvider";

const UpdateEmployee = ({ employee, onClose, onUpdate }) => {

  const [formData, setFormData] = useState({
    fullName: "",
    personalEmail: "",
    phoneNo: "",
    address: "",
    department: "",
    designation: "",
    isActive: "",
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: ""
    }
  });

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { showToast } = useToast();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await fetch("https://hrms-api.tipsg.in/department");
        const depData = await depRes.json();
        if (depData.status) {
          setDepartments(depData.data);
        }
       setFormData({
            fullName: employee.fullName || "",
            personalEmail: employee.personalEmail || "",
            phoneNo: employee.phoneNo || "",
            address: employee.address || "",
            department: employee.designation?.department?._id || "",
            designation: employee?.designation?._id || "",
            // password: employee.password || "",
            isActive: typeof employee.isActive === "string" ? employee.isActive : "Active",
            bankDetails: {
              bankName: employee.bankDetails?.bankName || "",
              accountNumber: employee.bankDetails?.accountNumber || "",
              ifscCode: employee.bankDetails?.ifscCode || "",
              branchName: employee.bankDetails?.branchName || ""
            }
          });
        if (employee?.documents?.profileImage) {
          setProfilePreview(`https://hrms-api.tipsg.in/uploads/${employee.documents.profileImage}`);
        }

    } catch (err) {
      console.error("Error loading departments or designations", err);
    }
  };

  fetchData();
}, [employee]);

useEffect(() => {
  const fetchDesignations = async () => {
    if (formData.department) {
      try {
        const res = await fetch(`https://hrms-api.tipsg.in/designation?department_id=${formData.department}`);
        const data = await res.json();
        if (data.status) {
          setDesignations(data.data);
        }
      } catch (err) {
        console.error("Error fetching designations", err);
      }
    }
  };

  fetchDesignations();
}, [formData.department]);


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  }
};

// const handleImageUpload = async () => {
//   if (!profileImage) return;

//   const formData = new FormData();
//   formData.append("profileImage", profileImage);

//   try {
//     const res = await fetch(`https://hrms-api.tipsg.in/update-profile-image/${employee._id}`, {
//       method: "PATCH",
//       body: formData,
//     });

//     const data = await res.json();

//     if (res.ok) {
//       showToast("Profile image updated successfully.", "success");
//       onUpdate();
//     } else {
//       showToast(`Error: ${data.message}`, "error");
//     }
//   } catch (err) {
//     console.error("Image upload error:", err);
//     showToast("Something went wrong while uploading image.", "error");
//   }
// };
const handleImageUpload = async () => {
  if (!profileImage) return;

  const formData = new FormData();
  formData.append("file", profileImage);   // 🔥 IMPORTANT
  formData.append("key", "profileImage");  // 🔥 IMPORTANT

  try {
    const res = await fetch(
      `https://hrms-api.tipsg.in/upload-document/${employee._id}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      showToast("Profile image updated successfully", "success");
      onUpdate(); // refresh SingleEmployee
    } else {
      showToast(data.message || "Image upload failed", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Error uploading image", "error");
  }
};



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("bankDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [key]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleImageUpload();
      
        const res = await fetch(`https://hrms-api.tipsg.in/employee/${employee._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (result.status) {
        showToast("Employee updated successfully.", "success");
        onUpdate();
        onClose();
      } else {
        showToast(`Error: ${result.message}`, "error");
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
    <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative">
    
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold"
    >
      &times;
    </button>

    {/* Modal Header */}
    <h2 className="text-3xl font-bold text-center text-purple-700 mb-6 border-b pb-4">Update Employee</h2>
    {/* Profile Image Preview + Edit */}
     <div className="flex items-center justify-center mb-6 gap-4 flex-col sm:flex-row">
     <div className="relative w-28 h-28">
      <img
      src={profilePreview || `https://hrms-api.tipsg.in/uploads/${employee?.documents?.profileImage}`}
      alt="Profile"
      className="w-28 h-28 object-cover rounded-full border-2 border-purple-500 shadow-md"
      />
    <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-purple-100">
      <svg className="w-5 h-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.414 2.586a2 2 0 010 2.828l-1.793 1.793-2.828-2.828 1.793-1.793a2 2 0 012.828 0zM2 13.586V18h4.414l10-10-4.414-4.414-10 10z"/>
      </svg>
    </label>
    <input
      type="file"
      id="profileImageInput"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  </div>
 
     </div>

    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
        <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
           pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
          title="Name should contain only letters, spaces, or periods and be at least 3 characters long"
          />
      </div>

      {/* Personal Email */}
      <div>
        <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-700 mb-1">Personal Email:</label>
        <input id="personalEmail" type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
          pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Enter a valid email address"
          /> 
      </div>

      {/* Phone No */}
      <div>
        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
        <input id="phoneNo" type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          pattern="^[6-9]\d{9}$"
          title="Enter a valid 10-digit Indian mobile number starting with 6-9" 
          />
      </div>
       
       {/* Status */}
       <div>
        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
        <select id="isActive" name="isActive" value={formData.isActive} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="Active">Active</option>
          <option value="InActive">Inactive</option>
        </select>
      </div>

      {/* Department */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
        <select id="department" name="department" value={formData.department} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ">
          <option value="">Salect Department</option>
          {departments.map((depart) => (
            <option key={depart._id} value={depart._id}>{depart.name}</option>
          ))}
        </select>
      </div>

      {/* Designation */}
      <div>
        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation:</label>
        <select id="designation" name="designation" value={formData.designation} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ">
          <option value="">Salect Designation</option>
          {designations.map((desg) => (
            <option key={desg._id} value={desg._id}>{desg.name}</option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className="col-span-2 md:col-span-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
        <textarea id="address" name="address" value={formData.address} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>

      {/* Bank Section Title */}
      <div className="col-span-2 mt-4">
        <h3 className="text-xl font-semibold text-purple-700">Bank Details</h3>
      </div>

      {/* Bank Name */}
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name:</label>
        <input id="bankName" type="text" name="bankDetails.bankName" value={formData.bankDetails.bankName} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
          pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
          title="Bank Name should contain only letters, spaces, or periods and be at least 3 characters long" 
          />
      </div>

      {/* Account Number */}
      <div>
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number:</label>
        <input id="accountNumber" type="text" name="bankDetails.accountNumber" value={formData.bankDetails.accountNumber} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
          pattern="\d{9,18}"
          title="Enter a valid account number (9 to 18 digits)"
          />
      </div>

      {/* IFSC */}
      <div>
        <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code:</label>
        <input id="ifscCode" type="text" name="bankDetails.ifscCode" value={formData.bankDetails.ifscCode} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          pattern="[A-Z]{4}0[A-Z0-9]{6}"
          title="Enter a valid 11-character IFSC code (e.g., SBIN0001234)"
          />
      </div>

      {/* Branch */}
      <div>
        <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">Branch Name:</label>
        <input id="branchName" type="text" name="bankDetails.branchName" value={formData.bankDetails.branchName} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
          title="Name should contain only letters, spaces, or periods and be at least 3 characters long"
          />
      </div>

      {/* Submit Button */}
      <div className="col-span-2 flex justify-end mt-6">
        <button type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-md">
          Update
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default UpdateEmployee;

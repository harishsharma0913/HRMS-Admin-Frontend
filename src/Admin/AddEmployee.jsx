import { useState, useEffect } from "react";
import { useToast } from "./Toast/ToastProvider";

const AddEmployee = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    personalEmail: "",
    officialEmail: "",
    phone: "",
    dob: "",
    bloodGroup: "",
    address: "",
  });

  const [documents, setDocuments] = useState({
    profileImage: null,
    aadhar: null,
    pan: null,
    tenth: null,
    twelfth: null,
    ug: null,
    pg: null,
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    ifsc: "",
    accountNumber: "",
    branch: "",
  });
  
  const [experience, setExperience] = useState([
  { companyName: "", designation: "", from: null, to: null },
]);

const handleExperienceChange = (e, index) => {
  const { name, value } = e.target;
  setExperience((prev) =>
    prev.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    )
  );
};

const addExperience = () => {
  const lastExp = experience[experience.length - 1];
  if (
    !lastExp.companyName ||
    !lastExp.designation ||
    !lastExp.from ||
    !lastExp.to
  ) {
    showToast("Please fill all fields in the current experience before adding another.", "error");
    return;
  }

  setExperience((prev) => [
    ...prev,
    { companyName: "", designation: "", from: null, to: null },
  ]);
};


const removeExperience = (index) => {
  setExperience((prev) => prev.filter((_, i) => i !== index));
};
 
const [others, setOthers] = useState({
    designation: "",
    password: "",
    isActive: "",
    doj: "",
});

  const handleChange = (e, sectionSetter) => {
    const { name, value } = e.target;
    const lowercasedValue = ["personalEmail", "officialEmail"].includes(name) ? value.toLowerCase() : value;
    sectionSetter((prev) => ({ ...prev, [name]: lowercasedValue }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments((prev) => ({ ...prev, [name]: files[0] }));
  };

const handleFinalSubmit = async (e) => {
  e.preventDefault();
  try {
    const form = new FormData();
    // Step 1: Basic Info
    form.append("fullName", formData.fullName);
    form.append("personalEmail", formData.personalEmail);
    form.append("officialEmail", formData.officialEmail);
    form.append("phoneNo", formData.phone);
    form.append("dob", formData.dob);
    form.append("bloodGroup", formData.bloodGroup);
    form.append("address", formData.address);

    // // Step 2: Documents
    form.append("profileImage", documents.profileImage);
    form.append("aadhar", documents.aadhar);
    form.append("pan", documents.pan);
    form.append("marksheets_ten", documents.tenth);
    form.append("marksheets_twel", documents.twelfth);
    form.append("marksheets_ug", documents.ug);
    if (documents.pg) {
      form.append("marksheets_pg", documents.pg);
     }


    // Step 3: Bank Details
    form.append("bankDetails[bankName]", bankDetails.bankName);
    form.append("bankDetails[accountNumber]", bankDetails.accountNumber);
    form.append("bankDetails[ifscCode]", bankDetails.ifsc);
    form.append("bankDetails[branchName]", bankDetails.branch);

    // Step 4: Experience
    experience.forEach((exp, index) => {
  form.append(`experience[${index}][companyName]`, exp.companyName || "");
  form.append(`experience[${index}][designation_1]`, exp.designation || "");

  const from =
    exp.from instanceof Date
      ? exp.from.toISOString().split("T")[0]
      : typeof exp.from === "string"
      ? exp.from
      : "";

  const to =
    exp.to instanceof Date
      ? exp.to.toISOString().split("T")[0]
      : typeof exp.to === "string"
      ? exp.to
      : "";

  form.append(`experience[${index}][from]`, from);
  form.append(`experience[${index}][to]`, to);
});



    // Step 5: Others
    form.append("designation", others.designation);
    form.append("password", others.password); 
    form.append("status", others.isActive);
    form.append("doj", others.doj);
   

    // Submit to API
    const response = await fetch("http://localhost:5000/employee", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      showToast(`Error: ${errorData.message}`, "error");
      return;
    }

    const result = await response.json();
    // console.log("Employee added:", result);
    showToast("Employee added successfully.", "success");
    onClose();
  }catch (error) {
  // console.log("Error submitting form:", error.message || error);
  showToast(`Error: ${error.message || "Something went wrong"}`, "error");
}
};

  const StepTitle = [
    "Basic Information",
    "Upload Documents",
    "Bank Details",
    "Experience",
    "Other Information",
  ];

useEffect(() => {
  fetch("http://localhost:5000/department")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch departments");
      }
      return res.json();
    })
    .then((data) => {
      setDepartments(data.data);  
          
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}, []);


useEffect(() => {
  if (!others.department) return;

  fetch(`http://localhost:5000/designation?department_id=${others.department}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch designations");
      }
      return res.json();
    })
    .then((data) => {
      setDesignations(data.data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}, [others.department]);


  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 sm:p-8 animate-fade-in-down relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">Add Employee - {StepTitle[step - 1]}</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-3xl font-bold hover:scale-125 transition-transform"
          >
            &times;
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="text" name="fullName" value={formData.fullName} onChange={(e) => handleChange(e, setFormData)} placeholder="Full Name *" className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" required
            pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
            title="Name should contain only letters, spaces, or periods and be at least 3 characters long"
            />
            <input type="text" name="personalEmail" value={formData.personalEmail} onChange={(e) => handleChange(e, setFormData)} placeholder="Personal Email *" className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" required 
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
             title="Enter a valid email address"
             />
            <input type="email" name="officialEmail" value={formData.officialEmail} onChange={(e) => handleChange(e, setFormData)} placeholder="Official Email *" className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400"
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
             title="Enter a valid email address"
              />
            <input 
             type="tel"
             name="phone" 
             value={formData.phone} 
             onChange={(e) => handleChange(e, setFormData)} 
             placeholder="Phone Number *" 
             className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" 
             required 
             pattern="^[6-9]\d{9}$"
             title="Enter a valid 10-digit Indian mobile number starting with 6-9"
            />
            <div className="flex flex-col">
            <label htmlFor="dob" className="mb-1 text-sm font-medium text-gray-700">Date of Birth :</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={(e) => handleChange(e, setFormData)} className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" required />
            </div>
            <div className="flex flex-col">
            <label htmlFor="dob" className="mb-1 text-sm font-medium text-gray-700">Blood Group :</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={(e) => handleChange(e, setFormData)} className="bg-purple-200 p-[9px] rounded-lg focus:outline-purple-400 border-r-[10px] border-transparent" required>
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            </div>
            
            <textarea name="address" value={formData.address} onChange={(e) => handleChange(e, setFormData)} placeholder="Address *" rows={3} className="w-full col-span-1 sm:col-span-2 bg-purple-200 p-2 rounded-lg focus:outline-purple-400 resize-none" required />
            <div className="col-span-2 text-right mt-2">
              <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">Next</button>
            </div>
          </form>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      setStep(3);
    }}
    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
  >
    {[
      { name: "profileImage", label: "Profile Image :" },
      { name: "aadhar", label: "Aadhar Card :" },
      { name: "pan", label: "PAN Card :" },
      { name: "tenth", label: "10th Marksheet :" },
      { name: "twelfth", label: "12th Marksheet :" },
      { name: "ug", label: "UG Degree :" },
      { name: "pg", label: "PG Degree :" },
    ].map(({ name, label }) => (
      <div key={name} className="w-full">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          type="file"
          name={name}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="w-full bg-purple-200 text-sm p-2 rounded-lg focus:outline-purple-400"
          // required
        />
      </div>
    ))}

    <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4">
      <button
        type="button"
        onClick={() => setStep(1)}
        className="bg-gray-300 text-sm px-6 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
      >
        Back
      </button>
      <button
        type="submit"
        className="bg-purple-600 text-white text-sm px-6 py-2 rounded hover:bg-purple-700 w-full sm:w-auto"
      >
        Next
      </button>
    </div>
  </form>
       )}

        {/* Step 3: Bank Details */}
        {step === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
            type="text" 
            name="bankName" 
            value={bankDetails.bankName} 
            onChange={(e) => handleChange(e, setBankDetails)} 
            placeholder="Bank Name *" 
            className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" 
            required
            pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
            title="Bank Name should contain only letters, spaces, or periods and be at least 3 characters long" 
            />
            <input type="text" name="ifsc" value={bankDetails.ifsc} 
            onChange={(e) => handleChange(e, setBankDetails)} 
            placeholder="IFSC Code *" 
            className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" 
            pattern="[A-Z]{4}0[A-Z0-9]{6}"
            title="Enter a valid 11-character IFSC code (e.g., SBIN0001234)"
            required 
            />
            <input type="text" name="accountNumber" value={bankDetails.accountNumber} onChange={(e) => handleChange(e, setBankDetails)} placeholder="Account Number *" className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" 
             pattern="\d{9,18}"
             title="Enter a valid account number (9 to 18 digits)"
            required
              />
            <input type="text" name="branch" value={bankDetails.branch} onChange={(e) => handleChange(e, setBankDetails)} placeholder="Branch Name *" className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" required 
            pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
            title="Name should contain only letters, spaces, or periods and be at least 3 characters long"
            />
            <div className="col-span-2 flex justify-between mt-4">
              <button onClick={() => setStep(2)} type="button" className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Back</button>
              <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Next</button>
            </div>
          </form>
        )}

        {/* Step 4: Experience */}
        {step === 4 && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      setStep(5);
    }}
    className="flex flex-col gap-4"
  >
    <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
      {experience.map((exp, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 rounded-lg bg-purple-100"
        >
          <input
            type="text"
            name="companyName"
            value={exp.companyName} 
            onChange={(e) => handleExperienceChange(e, index)}
            placeholder="Company Name *"
            className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400" 
            required = {false}
            pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
            title="Company Name should contain only letters, spaces, or periods and be at least 3 characters long"
          />
          <input
            type="text"
            name="designation"
            value={exp.designation}
            onChange={(e) => handleExperienceChange(e, index)}
            placeholder="Designation *"
            className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400"
            required = {false}
            pattern="^[A-Za-z][A-Za-z\s.]{1,}[A-Za-z]$"
            title="Designation should contain only letters, spaces, or periods and be at least 3 characters long"
          />

          <div className="flex flex-col">
            <label htmlFor={`from-${index}`} className="mb-1 text-sm font-medium text-gray-700">
              From :
            </label>
            <input
              id={`from-${index}`}
              type="date"
              name="from"
              value={exp.from}
              onChange={(e) => handleExperienceChange(e, index)}
              className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400"
              required ={false}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor={`to-${index}`} className="mb-1 text-sm font-medium text-gray-700">
              To :
            </label>
            <input
              id={`to-${index}`}
              type="date"
              name="to"
              value={exp.to}
              onChange={(e) => handleExperienceChange(e, index)}
              className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400"
              required ={false}
            />
          </div>

          {experience.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="col-span-1 sm:col-span-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}

    </div>

    <div className="flex justify-between mt-2">
      <button
        type="button"
        onClick={() => setStep(3)}
        className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
      >
        Back
      </button>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={addExperience}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          + Add More
        </button>
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Next
        </button>
      </div>
    </div>
  </form>
        )}

        {/* Step 5: Others */}
        {step === 5 && (
        <form onSubmit={handleFinalSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          name="department"
          value={others.department}
          onChange={(e) => handleChange(e, setOthers)}
          className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400 border-r-[10px] border-transparent"
          required
         >
       <option value="">Select Department</option>
       {departments.map((dept) => (
       <option key={dept._id} value={dept._id}>
       {dept.name}
      </option>
      ))}
       </select>
  
   <select
    name="designation"
     value={others.designation}
     onChange={(e) => handleChange(e, setOthers)}
     className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400 border-r-[10px] border-transparent"
    required
    disabled={!others.department}  
   >
  <option value="">Select Designation</option>
  {designations.map((desig) => (
    <option key={desig._id} value={desig._id}>
      {desig.name}
    </option>
  ))}
    </select>

   

    <input
      type="password"
      name="password"
      value={others.password}
      onChange={(e) => handleChange(e, setOthers)}
      placeholder="Password *"
      className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400"
      required
      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
     title="Password must be 8-20 characters long, include uppercase, lowercase, number, and special character"
    />
    <select
      name="isActive"
      value={others.isActive}
      onChange={(e) => handleChange(e, setOthers)}
      className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400 border-r-[10px] border-transparent"
      required
    >
      <option value="">IsActive</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
     <div className="flex flex-col ">
      <label htmlFor="doj" className="mb-1 text-sm font-medium text-gray-700">
        Date of Joining :
      </label>
      <input
        id="doj"
        type="date"
        name="doj"
        value={others.doj}
        onChange={(e) => handleChange(e, setOthers)}
        className="bg-purple-200 p-2 rounded-lg focus:outline-purple-400"
        required
      />
    </div>

    <div className="col-span-2 flex justify-between mt-4">
      <button
        onClick={() => setStep(4)}
        type="button"
        className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
      >
        Back
      </button>
      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Submit
      </button>
    </div>
  </form>
        )}

      </div>
    </div>
  );
};

export default AddEmployee;

import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addDesignation, getDesignations } from "../ReduxToolkit/department";   // <-- IMPORT
import { useToast } from "../Toast/ToastProvider";

export default function AddDescription({ open, setOpen, departments = [] }) {
  const [description, setDescription] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const { showToast } = useToast();
  const dispatch = useDispatch();  // <-- DISPATCH

  if (!open) return null;

  const handleSubmit = async() => {
    if (!description.trim()) return showToast("Description is required!", "error");
    if (!selectedDept) return showToast("Please select a department!", "error");

    const payload = {
      name: description,         // designation name = description
      department_id: selectedDept,  // department id
    };

     const res = await dispatch(addDesignation(payload));   // <-- API CALL

     if(res?.payload && res.payload._id){
      showToast("Designation Added Successfully!", "success");
      dispatch(getDesignations());
      setDescription("");
      setSelectedDept("");
      setOpen(false);
     } else{
      showToast("Failed to add designation!", "error");
     }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[420px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">Add Description</h2>
          <span>
            <IoCloseCircleOutline
              onClick={() => setOpen(false)}
              className="cursor-pointer text-2xl text-gray-700 hover:text-red-800"
            />
          </span>
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium">Description *</label>
            <input
              type="text"
              placeholder="Enter description"
              className="w-full border border-gray-400 bg-gray-300 p-2 rounded-lg focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Department *</label>
            <select
              className="w-full border border-gray-400 bg-gray-300 p-2 rounded-lg focus:outline-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">Select Department</option>

              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}

            </select>
          </div>
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 font-semibold bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

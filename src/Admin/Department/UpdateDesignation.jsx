import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { updateDesignation, getDesignations } from "../ReduxToolkit/department";
import { useToast } from "../Toast/ToastProvider";

export default function UpdateDesignation({
  open,
  setOpen,
  departments = [],
  existingData
}) {
  const [name, setName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // 🟦 Pre-fill form when editing
  useEffect(() => {
    if (existingData) {
      setName(existingData.name || "");
      setSelectedDept(existingData.department_id?._id || "");
    }
  }, [existingData]);

  if (!open) return null;

  // 🟩 Handle Update Submit
  const handleSubmit = async () => {
    if (!name.trim()) return showToast("Designation name is required!", "error");
    if (!selectedDept) return showToast("Please select a department!", "error");

    const payload = {
      id: existingData._id,
      name: name,
      department_id: selectedDept
    };

    const res = await dispatch(updateDesignation(payload));

    console.log(res);
    

    if (res?.meta?.requestStatus === "fulfilled") {
      showToast("Designation Updated Successfully!", "success");
      dispatch(getDesignations()); // refresh list
      setOpen(""); // close popup
    } else {
      showToast("Failed to update designation!", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[420px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">Update Designation</h2>

          <IoCloseCircleOutline
            onClick={() => setOpen("")}
            className="cursor-pointer text-2xl text-gray-700 hover:text-red-800"
          />
        </div>

        <div className="flex flex-col gap-4">
          {/* Designation Name */}
          <div>
            <label className="text-sm font-medium">Designation *</label>
            <input
              type="text"
              placeholder="Enter designation name"
              className="w-full border border-gray-400 bg-gray-300 p-2 rounded-lg focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Department Select */}
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

        {/* Buttons */}
        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={() => setOpen("")}
            className="px-4 py-2 font-semibold bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

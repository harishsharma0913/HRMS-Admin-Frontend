import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { updateDepartment, getDepartments } from "../ReduxToolkit/department";
import { useToast } from "../Toast/ToastProvider";

export default function UpdateDepartment({ open, setOpen, existingData }) {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // 🟦 Form pre-fill when editing
  useEffect(() => {
    if (existingData) {
      setDepartmentName(existingData.name || "");
      setDescription(existingData.description || "");
    }
  }, [existingData]);

  if (!open) return null;

  // 🟩 Handle Update Submit
 const handleSubmit = async () => {
  if (!departmentName.trim()) return showToast("Department Name is required!", "error");
  if (!description.trim()) return showToast("Description is required!", "error");

  const payload = {
    id: existingData._id,
    name: departmentName,
    description,
  };

  const res = await dispatch(updateDepartment(payload));

  if (res?.meta?.requestStatus === "fulfilled") {
    showToast("Department Updated Successfully!", "success");
    dispatch(getDepartments());
    setOpen("");
  } else {
    showToast("Failed to update department!", "error");
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">Update Department</h2>
          <IoCloseCircleOutline
            onClick={() => setOpen("")}
            className="cursor-pointer text-2xl text-gray-700 hover:text-red-800"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium">Department *</label>
            <input
              type="text"
              className="w-full border border-gray-400 bg-gray-300 p-2 rounded-lg focus:outline-none"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description *</label>
            <input
              type="text"
              className="w-full border border-gray-400 bg-gray-300 p-2 rounded-lg focus:outline-none"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 font-semibold rounded-lg bg-gray-300 hover:bg-gray-400"
            onClick={() => setOpen("")}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

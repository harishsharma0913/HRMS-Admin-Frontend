import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import AddDepartment from "./AddDepartment";
import AddDescription from "./AddDescription";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartment,
  deleteDesignation,
  getDepartments,
  getDesignations,
} from "../ReduxToolkit/department";
import UpdateDepartment from "./UpdateDepartment";
import UpdateDesignation from "./UpdateDesignation";
import { useToast } from "../Toast/ToastProvider";

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState("Departments");
  const [open, setOpen] = useState("");
  const [updateData, setUpdateData] = useState(null);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { departments, designations, loading } = useSelector(
    (state) => state.organization
  );

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "Designations") {
      dispatch(getDesignations());
    }
  }, [activeTab, dispatch]);

const handleDelete = (id) => {
  if (activeTab === "Departments") {
    dispatch(deleteDepartment(id))
      .unwrap()
      .then(() => {
        showToast("Department deleted successfully", "success");
      })
      .catch((err) => {
        showToast(err, "error");   // backend message aayega
      });
  } else {
    dispatch(deleteDesignation(id))
      .unwrap()
      .then(() => {
        showToast("Designation deleted successfully", "success");
      })
      .catch((err) => {
        showToast(err, "error");
      });
  }
};


  const handleUpdate = (item) => {
    setUpdateData(item);

    if (activeTab === "Departments") {
      setOpen("updateDepartment");
    } else {
      setOpen("updateDesignation");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="hidden md:flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-2xl text-purple-600">Department Management</h1>
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

      <div className="p-6 h-screen bg-pink-50">
        <h1 className="text-3xl font-semibold">Organization Management</h1>
        <p className="text-gray-600 mb-6">
          Manage departments and designations
        </p>

        {/* Tabs */}
        <div className="mb-6 p-1 bg-gray-300 rounded-3xl inline-block">
          <button
            onClick={() => setActiveTab("Departments")}
            className={`px-4 py-1 font-semibold rounded-full transition ${
              activeTab === "Departments" ? "bg-white" : "bg-gray-300"
            }`}
          >
            Departments
          </button>

          <button
            onClick={() => setActiveTab("Designations")}
            className={`px-4 py-1 rounded-full font-semibold transition ${
              activeTab === "Designations" ? "bg-white" : "bg-gray-300"
            }`}
          >
            Designations
          </button>
        </div>

        {/* Add Button */}
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => setOpen(activeTab)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
          >
            <Plus size={18} /> Add {activeTab}
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-100 shadow border border-gray-300 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-center">
                <th className="p-3">ID</th>

                <th className="p-3">
                  {activeTab === "Departments"
                    ? "Department Name"
                    : "Designation Name"}
                </th>

                {activeTab === "Departments" && (
                  <th className="p-3">Description</th>
                )}

                {activeTab === "Designations" && (
                  <th className="p-3">Department</th>
                )}

                <th className="p-3">Created At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-600 text-lg"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                (activeTab === "Departments"
                  ? departments
                  : designations
                ).map((item, index) => (
                  <tr key={item._id} className="border-t text-center">
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3">{item.name}</td>

                    {activeTab === "Departments" && (
                      <td className="p-3">{item.description}</td>
                    )}

                    {activeTab === "Designations" && (
                      <td className="p-3">
                        {item.department_id?.name || "N/A"}
                      </td>
                    )}

                    <td className="p-3">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-3 flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(item)}
                        className="text-gray-700 hover:text-black"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUPS */}
      {open === "Departments" && (
        <AddDepartment open={open} setOpen={setOpen} />
      )}

      {open === "Designations" && (
        <AddDescription
          open={open}
          setOpen={setOpen}
          departments={departments}
        />
      )}

      {open === "updateDepartment" && (
        <UpdateDepartment
          open={open}
          setOpen={setOpen}
          existingData={updateData}
        />
      )}

      {open === "updateDesignation" && (
        <UpdateDesignation
          open={open}
          setOpen={setOpen}
          existingData={updateData}
          departments={departments}
        />
      )}
    </div>
  );
}

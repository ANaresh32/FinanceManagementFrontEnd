import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/Styles/EmployeePages/Roles.css";
import editicon from "../../assets/Images/Editicon.png";
import deleteicon from "../../assets/Images/deleteicon.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import images from "../../assets/Images/User.png";
import axios from "axios";
import EditEmployeePopup from "./EditEmployeePopup";
import ImportPopup from "./ImportPopup";
import checkimage from "../../assets/Images/check.png";

const priorityMap = {
  1: "High",
  2: "Medium",
  3: "Low",
  4: "Low",
};

export default function Roles() {
  const navigate = useNavigate();
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setEditIsPopupOpen] = useState(false);
  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const EdittogglePopup = (e, index, roleId) => {
    setid(roleId);
    setEditIsPopupOpen(!isEditPopupOpen);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        "https://localhost:44305/api/Roles/AllRoles"
      );
      const sortedRoles = response.data.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return a.priority - b.priority;
      });
      setRoles(sortedRoles);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  const handleOpenPopup = async (e, index, id) => {
    var response = await axios.delete(
      `https://localhost:44305/api/Roles/${id}`
    );
    var result = response.data;
    if (result.isSuccess === true) {
      fetchRoles();
      setOpen(true);
    }
  };

  const closeDeletePopup = () => {
    setOpen(false);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allRoleIds = currentItems.map((role) => role.id);
      setSelectedRoleIds(allRoleIds);
      setDisiblebuttons(false);
    } else {
      setSelectedRoleIds([]);
      setDisiblebuttons(true);
    }
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  };

  const Addrolefuncton = () => {
    navigate("/dashboard/AddRoleModal");
  };

  const DeleteSelectedRecords = async () => {
    const response = await axios.put(
      "https://localhost:44305/api/Roles/DeleteSelectedRoles",
      selectedRoleIds
    );
    const result = response.data;

    if (result.isSuccess) {
      setOpen(true);
      fetchRoles();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRoles = roles.filter((role) => {
    return (
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.priority.toString().includes(searchQuery.toLowerCase())
    );
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCheckboxChange = (roleId, isChecked) => {
    setSelectedRoleIds((prevSelected) => {
      if (isChecked) {
        setDisiblebuttons(false);
        return [...prevSelected, roleId];
      } else {
        setDisiblebuttons(true);
        return prevSelected.filter((id) => id !== roleId);
      }
    });
  };

  const handleToggle = async (roleId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await axios.put(`https://localhost:44305/api/Roles/ToggleStatus`, {
        roleId,
        isEnabled: updatedStatus,
      });
      fetchRoles();
    } catch (error) {
      console.error("Error updating role status", error);
    }
  };

  return (
    <div className="Employeemaindiv">
      <div className="employeeheader">Role and Access</div>
      <div className="Employeelist">
        <div
          className="row"
          style={{
            paddingTop: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="col-2">
            <p className="employeecontent">Roles list</p>
          </div>
          <div
            className="col-4"
            style={{ display: "flex", justifyContent: "end" }}
          ></div>
          <div className="col-6 d-flex justify-content-end pe-3">
            <div className="me-2">
              <button
                className="DeleteRecordbutton"
                disabled={disiblebuttons}
                onClick={DeleteSelectedRecords}
              >
                <span className="deleteSelectedSpan">Delete Selected</span>
              </button>
            </div>
            <div>
              <button
                style={{ display: "flex", width: "120px" }}
                className="add-new-project-button"
                onClick={Addrolefuncton}
              >
                <span>
                  <img
                    src={images}
                    alt=""
                    height="18px"
                    width="18px"
                    className="ms-2"
                  />
                </span>
                <span className="add-new-project-span ms-1">Add New Role</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="userCheckbox"
                  />
                </th>
                <th style={{ fontSize: "12px" }}>Role Name</th>
                <th style={{ fontSize: "12px" }}>Priority</th>
                <th style={{ fontSize: "12px" }}>Priority Number</th>
                <th style={{ fontSize: "12px" }}>Enable/Disable</th>
                <th style={{ fontSize: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((role, index) => (
                <tr
                  className="EmployeeListtablelistrow"
                  key={role.id}
                >
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(
                          role.id,
                          e.target.checked
                        )
                      }
                      className="row-checkbox"
                    />
                  </td>
                  <td>{role.name}</td>
                  <td>{priorityMap[role.priority]}</td>
                  <td>{role.priority}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={role.isEnabled}
                        onChange={() => handleToggle(role.id, role.isEnabled)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <img
                      src={editicon}
                      style={{
                        marginRight: "15px",
                        width: "25px",
                        cursor: "pointer",
                      }}
                      onClick={(e) =>
                        EdittogglePopup(e, index, role.id)
                      }
                      alt="Edit"
                    />
                    <img
                      src={deleteicon}
                      style={{ width: "25px", cursor: "pointer" }}
                      onClick={(e) => {
                        setid(role.id);
                        setIsPopupOpen(true);
                      }}
                      alt="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-text">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
         
        </div>

        {isPopupOpen && (
          <Popup open={isPopupOpen} closeOnDocumentClick onClose={togglePopup}>
            <div
              className="popup-content"
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "8px",
              }}
            >
              <div className="popup-title">
                <h4>Are you sure?</h4>
              </div>
              <div className="popup-buttons">
                <button
                  className="popup-button"
                  onClick={closeDeletePopup}
                >
                  Close
                </button>
                <button
                  className="popup-button"
                  onClick={handleOpenPopup}
                >
                  Confirm
                </button>
              </div>
            </div>
          </Popup>
        )}
        {isEditPopupOpen && (
          <EditEmployeePopup
            id={id}
            setEditIsPopupOpen={setEditIsPopupOpen}
            setRoles={setRoles}
            fetchRoles={fetchRoles}
          />
        )}
        {open && (
          <Popup open={open} closeOnDocumentClick onClose={closeDeletePopup}>
            <div className="popup-content" style={{ padding: "10px" }}>
              <div className="popup-title">
                <h4>Role deleted successfully!</h4>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
}

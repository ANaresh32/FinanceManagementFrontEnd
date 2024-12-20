import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/Styles/Employee.css";
import editicon from "../../assets/Images/Editicon.png";
import deleteicon from "../../assets/Images/deleteicon.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import images from "../../assets/Images/User.png";
import axios from "axios";
import EditEmployeePopup from "../Employee/EditEmployeePopup";
import ellips from "../../assets/Images/Ellipse.png";
import checkimage from "../../assets/Images/check.png";
import EmployeeDetails from "../Employee/EmployeeDetails";
import ImportPopup from "../Employee/ImportPopup";
import Dropdown from "react-bootstrap/Dropdown";
import { getSessionData } from "../../Service/SharedSessionData";
export default function Employees() {
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  var id = userDetails.employee.id;
  console.log(userDetails.employee.id, "============>user Login Deatisl");
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [DeleteEmployeesflog, SetDeletedEmployeeflog] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionData, setSessionDataState] = useState(null);

  //   useEffect(() => {
  //     const subscription = getSessionData().subscribe({
  //       next: (data) => {
  //         setSessionDataState(data);
  //         console.log(data, "Updated sessionData");
  //       },
  //       error: (err) => {
  //         console.error("Error fetching session data: ", err);
  //       },
  //     });

  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   }, []);
  useEffect(() => {
    FetchData();
  }, [selectedEmployeeIds, isDivVisible, id]);

  const EdittogglePopup = (e, index, employeeid) => {
    sessionStorage.setItem("EmployeeID", employeeid);
    navigate("/dashboard/EditEmployee");
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const FetchData = async () => {
    const response = await axios.get(
      `https://localhost:44305/api/Employees/GetEmployeesByManager?id=${id}`
    );
    var result = response.data.item;
    //console.log(result, "managaer Employees");
    setEmployees(result);
  };
  console.log(employees, "=========>emplouyees");

  const handleOpenPopup = async (e, index, id) => {
    var response = await axios.put(
      `https://localhost:44305/api/Employees/DeleteEmployee?id=${id}`
    );
    var result = response.data;
    if (result.isSuccess === true) {
      FetchData();
      setOpen(true);
    }
  };

  const closeDeletePopup = () => {
    setOpen(false);
  };
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    if (isChecked && selectedEmployeeIds.length > 0) {
      const allEmployeeIds = currentItems.map((employee) => employee.id);
      setSelectedEmployeeIds(allEmployeeIds);

      setDisiblebuttons(false);
    } else {
      setSelectedEmployeeIds([]);
      setDisiblebuttons(true);
    }
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  };

  const Addemployeefuncton = () => {
    navigate("/dashboard/AddEmployee");
  };
  const DeleteSelectedRecords = async () => {
    const response = await axios.put(
      "https://localhost:44305/api/Employees/DeleteSelectedEmployees",
      selectedEmployeeIds
    );
    const result = response.data;

    if (result.isSuccess) {
      setOpen(true);
      FetchData();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCheckboxChange = (employeeId, isChecked) => {
    setSelectedEmployeeIds((prevSelected) => {
      let updatedSelected;
      if (isChecked) {
        updatedSelected = [...prevSelected, employeeId];
      } else {
        updatedSelected = prevSelected.filter((id) => id !== employeeId);
      }

      if (updatedSelected.length === 0) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }

      return updatedSelected;
    });
  };
  const DownloadExcel = async (listtype, filetype) => {
    let response;
    try {
      if (isDivVisible == false) {
        response = await axios.get(
          //   `https://localhost:44305/DownloadFile?listType=${listtype}&fileType=${filetype}&TypeOfEmployees=${"Active"}`,
          //   { responseType: "blob" }
          `https://localhost:44305/DownloadProjectManagerEmployees?listType=${listtype}&fileType=${filetype}&TypeOfEmployees=${"Active"}&ManagerId=${id}`,
          { responseType: "blob" }
        );
      } else {
        response = await axios.get(
          `https://localhost:44305/DownloadProjectManagerEmployees?listType=${listtype}&fileType=${filetype}&TypeOfEmployees=${"Inactive"}&ManagerId=${id}`,
          { responseType: "blob" }
        );
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      const fileName = `${listtype}_data.${
        filetype === "pdf" ? "pdf" : "xlsx"
      }`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const ViewDetails = (employeeid) => {
    sessionStorage.setItem("id", employeeid);
    navigate("/dashboard/EmployeeDetails");
  };
  const [deleteEmployeebuttondisible, setDeleteEmployeebuttonDisibled] =
    useState(true);

  const handleCheckboxChange1 = (e) => {
    setIsDivVisible(e.target.checked);
    setDeleteEmployeebuttonDisibled(false);
  };
  return (
    <div className="Employeemaindiv">
      <div className="employeeheader">Employees</div>
      <div className="Employeelist">
        <div className="row" style={{ paddingTop: "15px" }}>
          {isDivVisible ? (
            <div
              className="col-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p className="employeecontent" style={{ fontSize: "12px" }}>
                Employee's Deactivated
              </p>
            </div>
          ) : (
            <div className="col-5">
              <p className="employeecontent ms-3" style={{ fontSize: "12px" }}>
                Employee list
              </p>
            </div>
          )}
          {isDivVisible && <div className="col-3"></div>}
          <div
            className="col-3"
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <input
              type="text"
              className="searchinput"
              placeholder="Search employees"
              onChange={handleSearchChange}
              value={searchQuery}
              style={{
                fontSize: "12px",
                padding: "0px 8px",
                width: "100%",
                paddingRight: "30px",
                boxSizing: "border-box",
              }}
            />
            <i
              className="bi bi-search"
              style={{
                fontSize: "12px",
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
                pointerEvents: "none",
              }}
            ></i>
          </div>
          <div
            className="col-2"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              onChange={handleCheckboxChange1}
              className="DeleteCheckbox"
              style={{ height: "16px", width: "16px" }}
            />
            {!isDivVisible ? (
              <button
                disabled
                style={{
                  fontSize: "10px",
                  //color: "#9E9E9E",
                  color: "black",
                }}
                className="Show-Deleted-employee-button ms-1"
              >
                Show Deleted Employees
              </button>
            ) : (
              <button
                disabled={deleteEmployeebuttondisible}
                style={{
                  fontSize: "12px",
                }}
                className="Show-Deleted-employee-button ms-1"
              >
                <span className="deleteSelectedd"> Deleted Employees</span>
              </button>
            )}
          </div>

          <div className="col-1 " style={{ padding: "0px" }}>
            <Dropdown>
              <Dropdown.Toggle
                // variant="success"
                id="dropdown-basic"
                className="importdropdown btn btn-primary"
                style={{ fontSize: "12px", height: "30px" }}
              >
                Export To
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ paddingTop: "10px" }}>
                <Dropdown.Item
                  onClick={() => DownloadExcel("employees", "excel")}
                >
                  <p
                    className=""
                    style={{ fontSize: "12px", cursor: "pointer" }}
                  >
                    MS Excel
                  </p>
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ marginTop: "5px" }}
                  onClick={() => DownloadExcel("employees", "pdf")}
                >
                  Adobe PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {/* {!isDivVisible && (
            <div className="col-2 ">
              <button
                className="btn btn-danger deleteSelected"
                disabled={disiblebuttons}
                onClick={DeleteSelectedRecords}
                style={{
                  fontSize: "12px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                Delete Selected
              </button>
            </div>
          )} */}
          {/* {!isDivVisible && (
            <div className="col-2">
              <button
                style={{
                  display: "flex",
                  width: "auto",

                  alignContent: "center",
                  padding: "5px",
                  height: "30px",
                }}
                className="add-new-project-button"
                onClick={Addemployeefuncton}
              >
                <span>
                  <img
                    src={images}
                    alt=""
                    height="15px"
                    width="15px"
                    className="mb-3"
                  />
                </span>
                <span
                  className=" ms-1"
                  style={{
                    fontSize: "12px",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Add Employee
                </span>
              </button>
            </div>
          )} */}
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
                  {/* <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="userCheckbox"
                  /> */}
                </th>
                <th style={{ fontSize: "12px" }}>Employee ID</th>
                <th style={{ fontSize: "12px" }}>First Name</th>
                <th style={{ fontSize: "12px" }}>Last Name</th>
                <th style={{ fontSize: "12px" }}>Email</th>
                <th style={{ fontSize: "12px" }}>Mobile Number</th>
                <th style={{ fontSize: "12px" }}>Date of Joining</th>
                {!isDivVisible && <th style={{ fontSize: "12px" }}>Status</th>}

                <th style={{ fontSize: "12px" }}>Role</th>
                <th style={{ fontSize: "12px" }}>Reporting Manager</th>
                {isDivVisible && (
                  <th style={{ fontSize: "12px" }}>Date of Relieving</th>
                )}
                {/* {!isDivVisible && <th></th>}
                {!isDivVisible && <th></th>} */}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((employee, index) =>
                  !isDivVisible
                    ? employee.employeeStatus === 1 && (
                        <tr
                          key={employee.id}
                          className="tablebody"
                          style={{
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <td style={{ textAlign: "start" }}>
                            {/* <input
                              type="checkbox"
                              className="row-checkbox "
                              onChange={(e) =>
                                handleCheckboxChange(
                                  employee.id,
                                  e.target.checked
                                )
                              }
                            /> */}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.employeeId}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.firstName}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.lastName}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.email}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.mobileNo}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString("en-GB")}
                            {/* {new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString("en-GB")} */}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            Active
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.role.name}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.projectManager !== "N/A"
                              ? `${employee.projectManager.firstName} ${employee.projectManager.lastName}`
                              : "N/A"}
                          </td>
                          {/* <td>
                            <img
                              src={editicon}
                              onClick={(e) =>
                                EdittogglePopup(e, index, employee.id)
                              }
                              alt=""
                              style={{
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                              }}
                            />
                          </td> */}
                          {/* <td>
                            <img
                              src={deleteicon}
                              onClick={(e) =>
                                handleOpenPopup(e, index, employee.id)
                              }
                              alt=""
                              style={{
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                              }}
                            />
                          </td> */}
                        </tr>
                      )
                    : employee.employeeStatus === 0 && (
                        <tr
                          key={employee.id}
                          className="tablebody"
                          style={{
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <td style={{ textAlign: "start" }}>
                            {/* <input
                              type="checkbox"
                              className="row-checkbox "
                              onChange={(e) =>
                                handleCheckboxChange(
                                  employee.id,
                                  e.target.checked
                                )
                              }
                            /> */}
                          </td>
                          <td
                            style={{ fontSize: "12px ms-2" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.employeeId}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.firstName}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.lastName}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.email}
                          </td>
                          <td
                            style={{ fontSize: "12px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.mobileNo}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString("en-GB")}
                            {/* {new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString("en-GB")} */}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {employee.role.name}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {employee.projectManager !== "N/A"
                              ? `${employee.projectManager.firstName} ${employee.projectManager.lastName}`
                              : "N/A"}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            {new Date(
                              employee.dateOfReliving
                            ).toLocaleDateString("en-GB")}
                          </td>
                        </tr>
                      )
                )
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>No Records Found</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {open && (
          <div className="unique-popup-overlay">
            <div className="unique-popup-container">
              <div className="unique-popup-icon">
                <div className="ellipse-container">
                  <img
                    src={checkimage}
                    alt="Check"
                    className="check-image"
                    height="40px"
                    width="40px"
                  />
                  <img
                    src={ellips}
                    alt="Ellipse"
                    className="ellipse-image"
                    height="65px"
                    width="65px"
                  />
                </div>
              </div>
              <h2 className="unique-popup-title">Deleted Successfully</h2>
              <p className="unique-popup-message">
                Click OK to see the results
              </p>
              <button
                className="unique-popup-button"
                onClick={closeDeletePopup}
              >
                OK
              </button>
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <select
            style={{ cursor: "pointer", fontSize: "10px" }}
            className="numberpagenation ms-2"
            onChange={handleItemsPerPageChange}
            value={itemsPerPage}
          >
            <option value="10" style={{ fontSize: "12px" }}>
              Show 10 Entities
            </option>
            <option value="25" style={{ fontSize: "12px" }}>
              Show 25 Entities
            </option>
            <option value="50" style={{ fontSize: "12px" }}>
              Show 50 Entities
            </option>
            <option value="-1" style={{ fontSize: "12px" }}>
              Show All
            </option>
          </select>
          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              style={{ fontSize: "10px" }}
            >
              <span> Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  style={{
                    fontSize: "10px",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "active-page" : ""}
                >
                  {page}
                </button>
              )
            )}

            <button
              style={{ fontSize: "10px", color: "black", fontWeight: "600" }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <ImportPopup isOpen={isPopupOpen} handleClose={togglePopup} />
      </div>
    </div>
  );
}

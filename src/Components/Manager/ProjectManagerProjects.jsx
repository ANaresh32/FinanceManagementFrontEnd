import axios from "axios";
import "../../../src/assets/Styles/Projects.css";
import { useEffect } from "react";
import "../../../src/assets/Styles/Employee.css";
import { useState } from "react";
import { isPast } from "date-fns";
import image from "../../../src/assets/Images/Editicon.png";
import deleteimage from "../../src/../assets/Images/deleteicon.png";
import userimage from "../../../src/assets/Images/User.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import elipisimage from "../../../src/assets/Images/Ellipse.png";
import checkimage from "../../../src/assets/Images/check.png";
import { CoPresentOutlined } from "@mui/icons-material";
export default function ProjectManagerProjects() {
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  var id = userDetails.employee.id;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [Projects, setProjects] = useState([]);
  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);

  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    FetchData();
  }, [selectedProjectIds]);
  const FetchData = async () => {
    const response = await axios.get(
      `https://localhost:44305/api/EmployeeProjects/GetProjectManagerProjects?id=${id}`
    );
    const result = response.data;
    setProjects(result.item);
  };
  console.log(Projects);
  const AddNewProject = () => {
    navigate("/Dashboard/AddProject");
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredEmployees = Projects.filter((project) => {
    return (
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectID.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const DeleteMessageClose = async () => {
    setOpen(false);
  };
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
  const ViewProject = (projectid) => {
    sessionStorage.setItem("id", projectid);
    navigate("/dashboard/ViewProject");
  };

  return (
    <div className="">
      <p className="project-list-content">Projects</p>
      <div className="AllProject-maindiv">
        <div
          className="row"
          style={{
            paddingTop: "15px",
          }}
        >
          <div className="col-2">
            <p className="Project-list-content ms-3">Project list</p>
          </div>
          <div className="col-4"></div>
          <div className="col-2">
            <select
              className="numberpagenation"
              style={{ cursor: "pointer", height: "30px" }}
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
          </div>
          <div className="col-4">
            <input
              type="text"
              onChange={handleSearchChange}
              value={searchQuery}
              className="searchinput "
              placeholder="Search Projects"
              style={{ width: "280px", padding: "5px", fontSize: "12px" }}
            />
            <i
              className="bi bi-search"
              style={{
                fontSize: "12px",
                position: "absolute",
                left: "270px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
                pointerEvents: "none",
              }}
            ></i>
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
                <th style={{ fontSize: "12px" }}>Project ID</th>
                <th style={{ fontSize: "12px" }}>Project Name</th>
                <th style={{ fontSize: "12px" }}>Clients</th>
                <th style={{ fontSize: "12px" }}>Project Manager</th>
                <th style={{ fontSize: "12px" }}>Start Date</th>
                <th style={{ fontSize: "12px" }}>End Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(
                  (project, index) =>
                    project.status == 1 && (
                      <tr
                        key={index}
                        className="tablebody"
                        style={{ backgroundColor: "white", cursor: "pointer" }}
                      >
                        <td
                          style={{ fontSize: "12px" }}
                          onClick={(e) => ViewProject(project.id)}
                        >
                          {project.projectID}
                        </td>
                        <td
                          style={{ fontSize: "12px" }}
                          onClick={(e) => ViewProject(project.id)}
                        >
                          {project.projectName}
                        </td>
                        <td
                          style={{ fontSize: "12px" }}
                          onClick={(e) => ViewProject(project.id)}
                        >
                          {project.projectClient.clientName}
                        </td>
                        <td
                          style={{ fontSize: "12px" }}
                          onClick={(e) => ViewProject(project.id)}
                        >
                          {project.manager.firstName} {project.manager.lastName}
                        </td>
                        <td
                          style={{ fontSize: "12px" }}
                          onClick={(e) => ViewProject(project.id)}
                        >
                          {project.startDate}
                        </td>
                        <td
                          style={{ fontSize: "12px" }}
                          onClick={(e) => ViewProject(project.id)}
                        >
                          {project.endDate}
                        </td>
                      </tr>
                    )
                )
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "left" }}>No Records Found</td>
                  <td></td>

                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* {open && (
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
                    src={elipisimage}
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
                onClick={DeleteMessageClose}
              >
                OK
              </button>
            </div>
          </div>
        )} */}
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
                style={{ fontSize: "10px", color: "black", fontWeight: "600" }}
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
    </div>
  );
}

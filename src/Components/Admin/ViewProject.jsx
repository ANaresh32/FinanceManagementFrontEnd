import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../../assets/Styles/ViewProject.css";
import $, { data } from "jquery";
import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import withReactContent from "sweetalert2-react-content";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "datatables.net";
import { IoArrowBackCircle } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";
import { IoMdAddCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import AdminDashboardServices from "../../Service/AdminService/AdminDashboardServices";
import { getSessionData } from "../../Service/SharedSessionData";
import ImportPopup from "../Employee/ImportPopup";
import userimage from "../../assets/Images/User.png";
import deleteImage from "../../assets/Images/deleteicon.png";
import pulusimage from "../../assets/Images/plus.png";
import chechimage from "../../assets/Images/check.png";
import elipsimage from "../../assets/Images/Ellipse.png";
import Dropdown from "react-bootstrap/Dropdown";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import ImportProjectEmployees from "../Employee/ImportProjectEmployees";
export function ViewProject() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);
  const [Projectresponse, setresponse] = useState({});
  const [projectEmployess, setProjectEmployees] = useState([]);
  const [show, setShow] = useState(false);
  const [showw, setShoww] = useState(false);
  const handleClose = () => setShow(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [Employeeids, setIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [ProjectValues, setProjectValues] = useState({});
  const [clientvalues, setClientValues] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [GetAllemployees, setEmployees] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [projectManagerEmail, setProjectMangerEmail] = useState("");
  const [projectManagerName, setProjectMangerName] = useState("");
  const [sessiondata, setSessiondata] = useState(null);
  const [projectManagers, setProjectManagers] = useState([]);
  const [projectManagername, setProjectManagerName] = useState("");
  const navigate = useNavigate();
  const [sessionData, setSessionDataState] = useState(null);
  const [projectStartDate1, setprojectStartDate] = useState("");
  const [projectDeadline1, setprojectDeadline] = useState("");
  const [searchText, setSearchText] = useState("");
  const ProjectID = sessionStorage.getItem("id");
  const [isOpen, setisOpen] = useState(false);
  const [Projects, setProjects] = useState([]);
  const [status, setStatus] = useState("InActive");
  const [ProjectProgress, setProjectprogress] = useState(0);
  const [employeelist, setEmployeelist] = useState([]);
  const [ReportingManagerId, setReportingManagerId] = useState("");
  const [open, setopen] = useState(false);
  const [clients, setClients] = useState([]);
  const [deleteemployeepopup, setdeleteEmployeepopup] = useState(false);
  useEffect(() => {
    FetchData();
    filteredEmployees;
  }, [ProjectID]);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  // useEffect(() => {
  //   setProgressPercentage(calculateProgressPercentage());
  //   console.log("percentage", calculateProgressPercentage());
  // }, [projectDeadline1]);
  // const currentDate = new Date();
  // const calculateProgressPercentage = () => {
  //   const projectStartDate = new Date(projectStartDate1);
  //   const projectDeadline = new Date(projectDeadline1);
  //   console.log(projectStartDate, "=========>");
  //   if (currentDate < projectStartDate) {
  //     return 0;
  //   } else if (currentDate > projectDeadline) {
  //     return 100;
  //   } else {
  //     const totalDuration = projectDeadline - projectStartDate;
  //     const remainingTime = projectDeadline - currentDate;
  //     const progressPercentage =
  //       ((totalDuration - remainingTime) / totalDuration) * 100;
  //     return Math.min(Math.max(progressPercentage, 0), 100);
  //   }
  // };
  useEffect(() => {
    setProgressPercentage(calculateProgressPercentage());
    console.log("percentage", calculateProgressPercentage());
  }, [projectDeadline1]);
  const currentDate = new Date();
  const calculateProgressPercentage = () => {
    // debugger;
    const projectStartDate = new Date(projectStartDate1);
    const projectDeadline = new Date(projectDeadline1);

    if (currentDate < projectStartDate) {
      return 0;
    } else if (currentDate > projectDeadline) {
      return 100;
    } else {
      const totalDuration = projectDeadline - projectStartDate;
      const remainingTime = projectDeadline - currentDate;
      const progressPercentage =
        ((totalDuration - remainingTime) / totalDuration) * 100;
      return Math.min(Math.max(progressPercentage, 0), 100);
    }
  };

  async function FetchData() {
    const Projects = await axios.get(
      "https://localhost:44305/api/Projects/GetAllProjects"
    );
    const Projectsresult = Projects.data;
    setProjects(Projectsresult.item);
    var projectManagerResponse =
      await AdminDashboardServices.GetProjectManager();
    setProjectManagers(projectManagerResponse.item);

    const userDetails = JSON.parse(localStorage.getItem("sessionData"));
    setSessiondata(userDetails.employee.role.name);
    var response1 = await AdminDashboardServices.fcngetEmployees();
    setEmployees(response1.item);
    var response = await axios.get(
      `https://localhost:44305/api/Projects/GetProject?id=${ProjectID}`
    );
    var result = response.data;
    if (result.isSuccess === true) {
      setClientValues(result.item.client);
      setProjectValues(result.item.project);
      setStatus(result.item.project.status);
      setProjectprogress(result.item.project.progress);
      setReportingManagerId(result.item.project.projectManager);
      setProjectEmployees(result.item.employeeProject);
      setProjectManagerName(result.item.projectMangerName);
      setprojectStartDate(result.item.project.startDate);
      setprojectDeadline(result.item.project.endDate);
    }
    var response = await AdminDashboardServices.fcngetEmployees();
    setEmployeelist(response.item);
    var response = await AdminDashboardServices.FcnGetAllClients();
    var result = response.item;
    setClients(result);
  }
  console.log(progressPercentage, "project percentage");
  const handleManagerOnChange = (event) => {
    const selectedManagerId = event.target.value;
    setReportingManagerId(selectedManagerId);
  };
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const setIsImportPopupOpenfunction = () => {
    setIsImportPopupOpen(!ImportPopup);
  };
  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
  };
  const handleProgressChange = (event) => {
    const selectedProgress = event.target.value;
    setProjectprogress(selectedProgress);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = projectEmployess.filter((project) => {
    return (
      project.employee.employeeId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.employee.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.employee.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const updateEmployee = () => {
    setisOpen(true);
  };
  const handleEditClose = () => {
    setisOpen(false);
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setProjectValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const UpdateProjectDetails = async () => {
    var response = await AdminDashboardServices.fcnUpdateProject(ProjectValues);
    if (response.isSuccess) {
      setisOpen(false);
      FetchData();
    }
  };

  const handleClosePopup = () => {
    setopen(false);
  };

  const toggleIcon = (e, index, id) => {
    setSelectedRowIds((prevSelectedRowIds) => {
      let newSelectedRowIds;
      if (id) {
        if (!prevSelectedRowIds.includes(id)) {
          newSelectedRowIds = [...prevSelectedRowIds, id];
        } else {
          newSelectedRowIds = prevSelectedRowIds.filter(
            (selectedId) => selectedId !== id
          );
        }
      } else {
        const rowId = obj[index].id;
        newSelectedRowIds = prevSelectedRowIds.filter(
          (selectedId) => selectedId !== rowId
        );
      }

      setIds(
        newSelectedRowIds.map((selectedId) => ({ employeeid: selectedId }))
      );

      return newSelectedRowIds;
    });
  };

  const addNewemployee = async () => {
    const requestBody = [
      {
        employeeids: Employeeids,
        id: ProjectValues.id,
      },
    ];
    var response = await AdminDashboardServices.fcnAssignEmployee(requestBody);

    if (response.isSuccess) {
      FetchData();
      setopen(false);
    }
  };
  const filteredEmployees1 = GetAllemployees.filter(
    (obj) =>
      obj.employee &&
      (obj.employee.firstName.toLowerCase().includes(searchQuery1) ||
        obj.employee.lastName.toLowerCase().includes(searchQuery1) ||
        obj.employee.employeeId.toString().includes(searchQuery1) ||
        obj.role.name.toLowerCase().includes(searchQuery1))
  );
  const Addemployeefunction = () => {
    setopen(true);
    filteredEmployees1.filter((el) => {
      if (
        projectEmployess.filter((proj) => proj.employee.id === el.employee.id)
          .length > 0
      ) {
        el.employee.isAlreadyAdded = true;
      } else {
        el.employee.isAlreadyAdded = false;
      }
    });
  };

  const handleSearchChange1 = (e) => {
    setSearchQuery1(e.target.value.toLowerCase());
  };
  async function handleDelete(id, projectid) {
    var response = await AdminDashboardServices.DeleteEmployeefcn(
      id,
      projectid
    );

    if (response.isSuccess) {
      setdeleteEmployeepopup(true);
    }
  }
  const closeDeletePopup = () => {
    setdeleteEmployeepopup(false);
    FetchData();
  };
  const DownloadExcel = async (listtype, filetype, proID) => {
    let response;
    try {
      response = await axios.get(
        `https://localhost:44305/DownloadProjectEmployees?listType=${listtype}&fileType=${filetype}&projectID=${proID}`,
        { responseType: "blob" }
      );

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

  return (
    <div className="viewProject-Main-div">
      <div className="view-Project">Project Details</div>
      <div className="view-project-div" style={{ paddingTop: "0" }}>
        <div className="row update-button-row">
          <div className="col-10"></div>
          <div className="col-2 button-col">
            <button className="update-button" onClick={(e) => updateEmployee()}>
              Update
            </button>
          </div>
        </div>
        <div className="row m-0  project-view-row">
          <div className="col-4">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Porject outline
            </p>
          </div>
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Start Date
            </p>
          </div>
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              end Date
            </p>
          </div>
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Project Manager
            </p>
          </div>
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Project Lead
            </p>
          </div>
        </div>
        <div
          className="row m-0 p-0"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="col-2 ">
            <div
              style={{ position: "relative", width: "100%", height: "30px" }}
            >
              <span
                className="Progress_percentage"
                style={{
                  position: "absolute",
                  left: `${Math.round(progressPercentage)}%`,
                  top: "-6px",

                  transform: "translateX(-50%)",
                  color: progressPercentage === 100 ? "white" : "black",
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginLeft: "18px",
                }}
              >
                {Math.round(progressPercentage)}%
              </span>
              <input
                style={{
                  width: "100%",
                  marginTop: "10px",
                  pointerEvents: "none",
                  backgroundColor: "#00CC1B",
                }}
                type="range"
                id="disabledRange"
                value={progressPercentage}
                readOnly
                max="100"
                min="0"
              />
            </div>
          </div>
          <div
            className="col-2 projectPrpgress"
            style={{ fontSize: "12px", margin: "0" }}
          ></div>
          <div
            className="col-2 projectPrpgress"
            style={{ fontSize: "12px", margin: "0" }}
          >
            {ProjectValues.startDate}
          </div>
          <div
            className="col-2 projectPrpgress"
            style={{ fontSize: "12px", margin: "0" }}
          >
            {ProjectValues.endDate}
          </div>
          <div
            className="col-2 projectPrpgress"
            style={{ fontSize: "12px", margin: "0" }}
          >
            {projectManagername}
          </div>
          <div
            className="col-2 projectPrpgress"
            style={{ fontSize: "12px", margin: "0" }}
          >
            {projectManagername}
          </div>
        </div>
        <div
          className="row m-0 project-view-row"
          style={{ paddingTop: "45px" }}
        >
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Client
            </p>
          </div>
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              client Email
            </p>
          </div>
          <div className="col-2">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Project Name
            </p>
          </div>
          <div className="col-6">
            <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
              Description
            </p>
          </div>
        </div>
        <div className="row m-0 pt-3">
          <div
            className="col-2 "
            style={{ fontWeight: "500", fontSize: "12px" }}
          >
            {clientvalues.clientName}
          </div>
          <div
            className="col-2 "
            style={{ fontWeight: "500", fontSize: "12px" }}
          >
            {clientvalues.clientEmailId}
          </div>
          <div
            className="col-2 "
            style={{ fontWeight: "500", fontSize: "12px" }}
          >
            {ProjectValues.projectName}
          </div>
          <div
            className="col-6 "
            style={{ fontWeight: "500", fontSize: "12px" }}
          >
            {ProjectValues.description}
          </div>
        </div>
        <div className="row underline-button-row"></div>
        <div className="row m-0" style={{ paddingTop: "15px" }}>
          <div className="col-2">
            <p className="projectPrpgress"> Project Team Members</p>
          </div>

          <div className="col-3" style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                className="searchinput"
                placeholder="Search employee"
                onChange={handleSearchChange}
                value={searchQuery}
                style={{
                  width: "100%",
                  padding: "5px 30px 5px 5px",
                  fontSize: "12px",
                  boxSizing: "border-box",
                }}
              />
              <i
                className="bi bi-search"
                style={{
                  fontSize: "12px",
                  position: "absolute",
                  right: "10px",
                  color: "#888",
                  pointerEvents: "none",
                }}
              ></i>
            </div>
          </div>
          <div className="col-3"></div>
          <div
            className="col-1"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <button
              style={{ fontSize: "12px", height: "30px" }}
              className="btn btn-primary"
              onClick={() => setIsImportPopupOpen(true)}
            >
              Import
            </button>
          </div>
          <div
            className="col-1"
            style={{
              display: "flex",

              justifyContent: "space-between",
            }}
          >
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="importdropdown btn btn-primary"
                style={{ fontSize: "12px", height: "30px" }}
              >
                Export To
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ paddingTop: "10px" }}>
                <Dropdown.Item
                  onClick={() => DownloadExcel("employees", "excel", ProjectID)}
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
                  onClick={() => DownloadExcel("employees", "pdf", ProjectID)}
                >
                  Adobe PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div
            className="col-2"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                display: "flex",
                width: "auto",
                alignContent: "center",
                padding: "4px",
                height: "30px",
              }}
              className="add-new-project-button"
              onClick={Addemployeefunction}
            >
              <span>
                <img
                  src={userimage}
                  alt=""
                  height="16px"
                  width="16px"
                  className="mb-2"
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
        </div>
        <div style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable m-0 p-0"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th style={{ fontSize: "12px", fontWeight: "500" }}>
                  Employee ID
                </th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>Name</th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>Email</th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>
                  Mobile Number
                </th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>Role</th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>
                  Project Tasks
                </th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>
                  Date Of joining
                </th>
                <th style={{ fontSize: "12px", fontWeight: "500" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className="tablebody"
                    style={{
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ fontSize: "12px" }}>
                      {employee.employee.employeeId}
                    </td>
                    <td
                      style={{ fontSize: "12px" }}
                    >{`${employee.employee.firstName} ${employee.employee.lastName} `}</td>
                    <td style={{ fontSize: "12px" }}>
                      {employee.employee.email}
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {employee.employee.mobileNo}
                    </td>
                    <td style={{ fontSize: "12px" }}>{employee.role}</td>
                    <td style={{ fontSize: "12px" }}>{projectManagername}</td>
                    <td style={{ fontSize: "12px" }}>
                      {new Date(
                        employee.employee.dateOfJoining
                      ).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      <img
                        src={deleteImage}
                        alt=""
                        style={{
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleDelete(
                            employee.employee.id,
                            employee.project.id
                          )
                        }
                      />
                    </td>
                  </tr>
                ))
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
        <ImportPopup isOpen={isPopupOpen} handleClose={togglePopup} />
        <ImportProjectEmployees
          IsProjectOpen1={isImportPopupOpen}
          handleClose1={setIsImportPopupOpenfunction}
        />
      </div>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modalheader">
              <h2 className="employeeDetailsContent">Update Project Details</h2>
              <span className="cancelicon1">
                <i
                  className="bi bi-x-lg"
                  onClick={handleEditClose}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </div>

            <div
              className="row  "
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <TextField
                  label="Project ID"
                  variant="outlined"
                  name="projectID"
                  onChange={handleOnChange}
                  value={ProjectValues.projectID || ""}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1rem",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                      fontSize: "1rem",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Projects && Projects.length > 0 ? (
                    Projects.map((project, index) => (
                      <MenuItem key={index} value={project.project.projectID}>
                        <span style={{ fontSize: "12px" }}>
                          {project.project.projectID}
                        </span>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Employees Found</MenuItem>
                  )}
                </TextField>
              </div>

              <div className="col-4">
                <TextField
                  label="Start Date"
                  variant="outlined"
                  type="date"
                  name="startDate"
                  value={
                    ProjectValues.startDate
                      ? new Date(ProjectValues.startDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  //value={ProjectValues.startDate}
                  onChange={handleOnChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",

                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
              <div className="col-4">
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={
                    ProjectValues.endDate
                      ? new Date(ProjectValues.endDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleOnChange}
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",

                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
            </div>
            <div
              className="row  employeeUpdateSkills"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <TextField
                  label="ProjectName"
                  value={ProjectValues.projectName || ""}
                  onChange={handleOnChange}
                  variant="outlined"
                  name="projectName"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",

                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
              <div className="col-4">
                <TextField
                  label="Project Referance ID"
                  variant="outlined"
                  name="projectRefId"
                  value={ProjectValues.projectRefId || ""}
                  onChange={handleOnChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",

                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>

              <div className="col-4">
                <TextField
                  label="Client Email"
                  variant="outlined"
                  name="clientId"
                  value={ProjectValues.clientId}
                  onChange={handleOnChange}
                  fullWidth
                  select
                  sx={{
                    // width: "85%",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontSize: "12px",
                      fontWeight: "600",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                      fontSize: "1rem",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select/Add Client</em>
                  </MenuItem>
                  {clients && clients.length > 0 ? (
                    clients.map((client, index) => (
                      <MenuItem key={client.id} value={client.id}>
                        <span style={{ fontSize: "12px" }}>
                          {" "}
                          {client.clientEmailId}
                        </span>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Client Found</MenuItem>
                  )}
                </TextField>
              </div>
            </div>
            <div
              className="row  employeeUpdateSkills"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <TextField
                  label="Project Manager"
                  variant="outlined"
                  name="projectManager"
                  onChange={handleOnChange}
                  value={ProjectValues.projectManager || ""}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",

                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {employeelist && employeelist.length > 0 ? (
                    employeelist.map((emp) => (
                      <MenuItem key={emp.employee.id} value={emp.employee.id}>
                        <span style={{ fontSize: "12px" }}>
                          {emp.employee.firstName} {emp.employee.lastName}
                        </span>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Employees Found</MenuItem>
                  )}
                </TextField>
              </div>
              <div className="col-4">
                <TextField
                  label="Status"
                  variant="outlined"
                  name="status"
                  value={ProjectValues.status}
                  onChange={handleOnChange}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value={1} style={{ fontSize: "12px" }}>
                    Active
                  </MenuItem>
                  <MenuItem value={0} style={{ fontSize: "12px" }}>
                    InActive
                  </MenuItem>
                </TextField>
              </div>
              <div className="col-4">
                <TextField
                  label="Progress"
                  variant="outlined"
                  name="progress"
                  value={ProjectValues.progress}
                  onChange={handleOnChange}
                  fullWidth
                  select
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      height: "22px",
                      padding: "8px 12px",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                >
                  <MenuItem value={10} style={{ fontSize: "12px" }}>
                    10%
                  </MenuItem>
                  <MenuItem value={20} style={{ fontSize: "12px" }}>
                    20%
                  </MenuItem>
                  <MenuItem value={30} style={{ fontSize: "12px" }}>
                    30%
                  </MenuItem>
                  <MenuItem value={40} style={{ fontSize: "12px" }}>
                    40%
                  </MenuItem>
                  <MenuItem value={50} style={{ fontSize: "12px" }}>
                    50%
                  </MenuItem>
                  <MenuItem value={60} style={{ fontSize: "12px" }}>
                    60%
                  </MenuItem>
                  <MenuItem value={70} style={{ fontSize: "12px" }}>
                    70%
                  </MenuItem>
                  <MenuItem value={80} style={{ fontSize: "12px" }}>
                    80%
                  </MenuItem>
                  <MenuItem value={90} style={{ fontSize: "12px" }}>
                    90%
                  </MenuItem>
                  <MenuItem value={100} style={{ fontSize: "12px" }}>
                    100%
                  </MenuItem>
                </TextField>
              </div>
            </div>
            <div
              className="row  employeeUpdateSkills"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-12">
                <TextField
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={ProjectValues.description || ""}
                  onChange={handleOnChange}
                  className="textareaclass"
                  fullWidth
                  multiline
                  rows={2}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      "& fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #DCDCDC",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000000",
                      fontWeight: "500",
                      transform: "translate(15px, 9px)",
                      "&.Mui-focused": {
                        color: "black",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      boxSizing: "border-box",
                    },
                    "& .MuiInputLabel-shrink": {
                      fontSize: "1rem",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& textarea::placeholder": {
                      fontSize: "12px",
                      color: "#AEAEAE",
                    },
                  }}
                />
              </div>
            </div>
            <div
              className=" row"
              style={{
                marginTop: "20px",
                marginLeft: "7px",
                marginRight: "12px",
              }}
            >
              <div className="col-4">
                <button
                  className="EditformSubmit"
                  onClick={UpdateProjectDetails}
                >
                  <span className="editformspan">Save</span>
                </button>
                <button
                  className="EditformCancel ms-2"
                  onClick={handleEditClose}
                >
                  <span className="editformcacelspan">Cancel</span>
                </button>
              </div>
              <div className="col-8"></div>
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h2 className="dialog-title">Add Employees</h2>
              <span className="dialog-close">
                <i
                  className="bi bi-x-lg"
                  onClick={handleClosePopup}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </div>

            <div className="row m-0 pb-3">
              <div className="col-3"></div>
              <div
                className="col-6"
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "15px",
                }}
              >
                <input
                  type="text"
                  className="searchinput"
                  placeholder="Search employees"
                  onChange={handleSearchChange1}
                  value={searchQuery1}
                  style={{
                    fontSize: "12px",
                    padding: "0px 10px",
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
                    top: "68%",
                    transform: "translateY(-50%)",
                    color: "#888",
                    pointerEvents: "none",
                  }}
                ></i>
              </div>
              <div className="col-3"></div>
            </div>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                overflowX: "hidden",

                padding: "0px 10px",
              }}
            >
              <table
                className="employeeTable1"
                style={{
                  width: "100%",

                  position: "relative",
                }}
              >
                <thead
                  className="employee-Details-table"
                  style={{
                    position: "sticky",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                  }}
                >
                  <tr>
                    <th style={{ padding: "0px 8px" }}>Employee ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th className="">Actions</th>
                  </tr>
                </thead>
                <tbody className="fixed_header tbody">
                  {filteredEmployees1.map((obj, index) =>
                    !obj.employee.isAlreadyAdded ? (
                      <tr
                        key={obj.employee.id}
                        className={
                          selectedRowIds.includes(obj.employee.id)
                            ? "selected-row  tablebody"
                            : ""
                        }
                      >
                        <td className="data" style={{ padding: "0px 8px" }}>
                          {obj.employee.employeeId}
                        </td>
                        <td className="data">{`${obj.employee.firstName}   ${obj.employee.lastName}`}</td>
                        <td className="data">{obj.role.name}</td>
                        <td style={{ width: "20px" }} className="data">
                          {selectedRowIds.includes(obj.employee.id) ? (
                            <RxCross2
                              onClick={(e) =>
                                toggleIcon(e, index, obj.employee.id)
                              }
                              className="cancleemployee"
                              style={{
                                cursor: "pointer",
                                color: "red",
                                width: "27px",
                                height: "28px",
                              }}
                            />
                          ) : (
                            <img
                              src={pulusimage}
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                toggleIcon(e, index, obj.employee.id)
                              }
                              alt=""
                              width="27px"
                              height="28px"
                            />
                          )}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="dialog-footer"
              style={{
                borderTop: "1px solid #ddd",
                padding: "10px 20px",
                textAlign: "right",
              }}
            >
              <button className="dialog-submit-btn" onClick={addNewemployee}>
                <span style={{ fontSize: "12px" }}>Add</span>
              </button>
            </div>
          </div>

          <ToastContainer position="top-end" autoClose={5000} />
        </div>
      )}
      {deleteemployeepopup && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-container">
            <div className="unique-popup-icon">
              <div className="ellipse-container">
                <img
                  src={chechimage}
                  alt="Check"
                  className="check-image"
                  height="40px"
                  width="40px"
                />
                <img
                  src={elipsimage}
                  alt="Ellipse"
                  className="ellipse-image"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
            <h2 className="unique-popup-title">
              Delete Employee Successfully!
            </h2>
            <p className="unique-popup-message">
              Click OK to view added project
            </p>
            <button className="unique-popup-button" onClick={closeDeletePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

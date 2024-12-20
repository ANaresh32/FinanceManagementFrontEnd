import { useEffect, useState, forwardRef } from "react";
import EmployeeService from "../../../Service/EmployeeService/EmployeeService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assets/Styles/TimeSheet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import TimeSheetService from "../../../Service/TimeSheetService";
import { GrPowerReset } from "react-icons/gr";
import { IoSaveOutline } from "react-icons/io5";
import axios from "axios";

export default function TimeSheet() {
  const [projectDetails, setProjectDetails] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [disabledTabs, setDisabledTabs] = useState([]);
  const [hours, setHours] = useState({});
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  const [selectedProjectId, setSelectedProjectID] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [ProjectEmployees, setProjectEmployees] = useState([]);
  const [disiblebuttons, setDisiblebuttons] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const [ProjectDepartment, setProjectDepartment] = useState("");
  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    if (projectDetails.length > 0) {
      const initialProject = projectDetails[selectedTabIndex].project.id;
      GetProjectDeatis(initialProject, selectedDate);
    }
  }, [projectDetails, selectedTabIndex, selectedDate, disiblebuttons]);

  async function FetchData() {
    const response = await EmployeeService.GetProjectInfo(
      userDetails.employee.id
    );
    const projects = response.item;

    setProjectDetails(projects);
  }

  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };

  const handleDateChange = async (projectId, date) => {
    const formattedDate = format(date, "MMMM yyyy");
    setSelectedDate(date);

    setHours({});

    await GetProjectDeatis(projectId, formattedDate);
  };

  const handleHoursChange = (employeeId, value) => {
    setHours((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const submitFunction = () => {
    const currentProject = projectDetails[selectedTabIndex];
    const employeeData = currentProject.employees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));
    return {
      projectId: currentProject.project.id,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };
  };

  const SaveForm = async () => {
    // const data = submitFunction();
    const currentProject = projectDetails[selectedTabIndex].project.id;

    const employeeData = ProjectEmployees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));
    var projectId = currentProject;
    var data = {
      projectId,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };

    const response = await TimeSheetService.AddNewTimeSheet(
      data,
      userDetails.employee.id,
      false
    );

    if (response.isSuccess) {
      toast.success("Successfully saved.", {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.error(response.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const SubmitFormFunction = async () => {
    const currentProject = projectDetails[selectedTabIndex].project.id;

    const employeeData = ProjectEmployees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));
    var projectId = currentProject;
    var data = {
      projectId,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };

    const response = await TimeSheetService.AddNewTimeSheet(
      data,
      userDetails.employee.id,
      true
    );
    if (response.isSuccess) {
      toast.success("Successfully submitted.", {
        position: "top-right",
        autoClose: 4000,
      });
      const projectId = projectDetails[selectedTabIndex].project.id;
      await GetProjectDeatis(projectId, selectedDate);
      setDisabledTabs((prev) => [...prev, selectedTabIndex]);
    } else {
      toast.error(response.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const GetProjectDeatis = async (id, date) => {
    setSelectedProjectID(id);
    const formattedDate = format(date, "MMMM yyyy");
    const ProjectEmployees = await axios.get(
      `https://localhost:44305/api/Timesheets/GetProjectEmployee?projectID=${id}&date=${formattedDate}`
    );
    const response = await TimeSheetService.GetTimeSheetDeatils(
      formattedDate,
      id
    );
    setProjectEmployees(ProjectEmployees.data.item.item1);
    setEmployees(response.item);
    setProjectDepartment(ProjectEmployees.data.item.item2);
    if (response.item.length > 0) {
      if (response.item.every((el) => el.isSubmited === true)) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
        setButtonStyle({ color: "white" });
      }
    } else {
      setDisiblebuttons(false);
      setButtonStyle({ color: "white" });
    }

    const newHours = {};
    response.item.forEach((each) => {
      newHours[each.employeeId] = each.workingHourse;
    });
    setHours(newHours);
  };

  const Resetfunction = (e) => {
    setHours({});
  };

  return (
    <div className="Maindiv">
      <div className="card" style={{ borderRadius: "0px" }}>
        <div>
          <p className="timesheet">Time Sheet</p>
        </div>

        <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabSelect}>
          <TabList>
            {projectDetails.map((obj, index) => (
              <Tab
                key={index}
                style={{ color: "blue" }}
                onClick={() => GetProjectDeatis(obj.project.id, selectedDate)}
              >
                {obj.project.projectName}
              </Tab>
            ))}
          </TabList>
          {projectDetails.length == 0 ? (
            <div
              style={{ textAlign: "center", color: "black", fontWeight: "600" }}
            >
              <p>No projects assigned</p>
            </div>
          ) : (
            projectDetails.map((project, projectIndex) => (
              <TabPanel key={projectIndex}>
                <div>
                  <div className="datepicker">
                    <DatePicker
                      style={{ alignItems: "end" }}
                      selected={selectedDate}
                      onChange={(date) =>
                        handleDateChange(project.project.id, date)
                      }
                      showMonthYearPicker
                      dateFormat="MMMM yyyy"
                      customInput={<CustomInput />}
                      className="w-100"
                      maxDate={maxDate}
                    />
                  </div>
                </div>

                <div className="row">
                  <table className="table table-striped mt-2">
                    <thead>
                      <tr>
                        <th className="tableheader">NAME</th>
                        <th className="tableheader">DEPARTMENT</th>
                        <th className="" style={{ textAlign: "center" }}>
                          STATUS
                        </th>
                        <th className="" style={{ textAlign: "center" }}>
                          ROLE
                        </th>
                        <th className="" style={{ textAlign: "center" }}>
                          HOURS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ProjectEmployees.length === 0 ? (
                        <tr>
                          <td></td>
                          <td></td>
                          <td>No employees in this project</td>
                          <td></td>
                          <td></td>
                        </tr>
                      ) : (
                        ProjectEmployees.map((emp, index) => (
                          <tr key={index}>
                            <td>
                              <div
                                className="d-flex"
                                style={{ alignItems: "center" }}
                              >
                                <div>
                                  <div className="empName ">
                                    {`${emp.firstName} ${emp.lastName}`}
                                  </div>
                                  <div className="">{emp.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ textAlign: "start" }}>
                                {ProjectDepartment}
                              </div>
                              <div
                                className="role"
                                style={{ textAlign: "start" }}
                              ></div>
                            </td>
                            <td>
                              <div
                                style={{
                                  backgroundColor:
                                    emp.employeeStatus === 1
                                      ? "#196e8a"
                                      : "#ADD8E6",
                                  borderRadius: "40px",
                                  color:
                                    emp.employeeStatus === 1
                                      ? "white"
                                      : "black",
                                  textAlign: "center",
                                }}
                              >
                                <span>
                                  {emp.employeeStatus == 1
                                    ? "Active"
                                    : "InActive"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div
                                className="role"
                                style={{ textAlign: "center" }}
                              >
                                {emp.role?.name || ""}
                              </div>
                            </td>
                            <td>
                              {employees.length > 0 &&
                              employees.some(
                                (obj) => obj.employeeId === emp.id
                              ) ? (
                                employees
                                  .filter((obj) => obj.employeeId === emp.id)
                                  .map((filteredEmployee) => (
                                    <div key={filteredEmployee.employeeId}>
                                      {filteredEmployee.isSubmited === true ? (
                                        <div style={{ textAlign: "center" }}>
                                          {filteredEmployee.workingHourse}
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            className="form-control w-50"
                                            value={hours[emp.id] || ""}
                                            onChange={(e) =>
                                              handleHoursChange(
                                                emp.id,
                                                e.target.value
                                              )
                                            }
                                            style={{ width: "150px" }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <input
                                    type="number"
                                    className="form-control w-50"
                                    value={hours[emp.id] || ""}
                                    onChange={(e) =>
                                      handleHoursChange(emp.id, e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {ProjectEmployees.length > 0 && (
                    <div className="d-flex" style={{ justifyContent: "end" }}>
                      <div className="me-4">
                        <button
                          className=" button  resetbutton"
                          onClick={Resetfunction}
                          disabled={disiblebuttons}
                        >
                          Reset
                        </button>
                      </div>
                      <div className="me-4">
                        <button
                          className=" savebutton button"
                          onClick={SaveForm}
                          disabled={disiblebuttons}
                        >
                          Save
                        </button>
                      </div>
                      <div>
                        <button
                          className="submitbutton button"
                          onClick={SubmitFormFunction}
                          disabled={disiblebuttons}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            ))
          )}
        </Tabs>
      </div>
      <ToastContainer position="top-end" autoClose={5000} />
    </div>
  );
}

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div
    className="custom-input"
    onClick={onClick}
    ref={ref}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "5px 10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: "5px" }} />
    <span>{value}</span>
  </div>
));

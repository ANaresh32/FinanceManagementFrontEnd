import "../../../src/assets/Styles/TimeSheet.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
import TimeSheetService from "../../Service/TimeSheetService";
import ellips from "../../../src/assets/Images/Ellipse.png";
import checkimage from "../../../src/assets/Images/check.png";
import { format } from "date-fns";
export default function TimeSheet() {
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  var id = userDetails.employee.id;

  const [selectedProject, setSelectedProject] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [projectOptions, setProjects] = useState([]);
  const [department, setDepartment] = useState("");
  const [getTimeSheet, setGetTimesheet] = useState([]);
  const [disiblebuttons, setDisiblebuttons] = useState(false);
  const [hours, setHours] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitOpen, setIssubmitOpen] = useState(false);
  const [ProjectEmployees, setProjectemployess] = useState([]);
  useEffect(() => {
    FetchData();
    const year = selectedDate.getFullYear();
    const month = selectedDate.toLocaleString("default", { month: "long" });
    const result = `${month} ${year}`;
    setFormattedDate(result);
  }, [selectedDate, ProjectEmployees, department]);

  async function FetchData() {
    const response = await EmployeeService.GetProjectInfo(id);
    const projects = response.item;
    const options = projects.map((p, index) => ({
      value: p.project.id,
      label: p.project.projectName,
    }));
    setProjects(options);
    const Timesheetresponse = await TimeSheetService.GetTimeSheetDeatils(
      formattedDate,
      selectedProject?.value
    );
    setGetTimesheet(Timesheetresponse.item);
    if (Timesheetresponse.item.length > 0) {
      if (Timesheetresponse.item.every((el) => el.isSubmited === true)) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }
    } else {
      setDisiblebuttons(false);
    }
    const newHours = {};
    Timesheetresponse.item.forEach((each) => {
      newHours[each.employeeId] = each.workingHourse;
    });
    setHours(newHours);
  }
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const formattedDate = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
    const ProjectEmployeess = await axios.get(
      `https://localhost:44305/api/Timesheets/GetProjectEmployee?projectID=${selectedProject.value}&date=${formattedDate}`
    );
    setHours({});
    var result = ProjectEmployeess.data;
    if (result.isSuccess) {
      setProjectemployess(result.item.item1);
      setDepartment(result.item.item2);
    }
  };

  const handleProjectChange = async (option) => {
    setSelectedProject(option);
    const ProjectEmployeess = await axios.get(
      `https://localhost:44305/api/Timesheets/GetProjectEmployee?projectID=${option.value}&date=${formattedDate}`
    );
    var result = ProjectEmployeess.data;
    setProjectemployess(result.item.item1);
    setDepartment(result.item.item2);
  };
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    control: (provided) => ({
      ...provided,
      height: "32px",
      minHeight: "32px",
    }),
    option: (provided) => ({
      ...provided,
      padding: "10px",
    }),
  };
  const handleHoursChange = (employeeId, value) => {
    setHours((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };
  const SubmitFormFunction = async () => {
    const employeeData = ProjectEmployees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));
    var projectId = selectedProject.value;
    var data = {
      projectId,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };
    const response = await TimeSheetService.AddNewTimeSheet(data, id, true);
    if (response.isSuccess) {
      setIssubmitOpen(true);
      FetchData();
    }
  };
  const Resetfunction = (e) => {
    setHours({});
  };
  const SaveForm = async () => {
    const employeeData = ProjectEmployees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
    }));

    var projectId = selectedProject.value;
    var data = {
      projectId,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };
    const response = await TimeSheetService.AddNewTimeSheet(data, id, false);
    if (response.isSuccess) {
      setIsOpen(true);
    }
  };
  console.log(ProjectEmployees.length, "projectemployees");
  return (
    <div>
      <div className="timeSheet_content">TimeSheet</div>
      <div className="TimeSheetMainDiv">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ paddingTop: "20px" }}>
            <span
              className="billing_hours_content "
              style={{ marginLeft: "10px" }}
            >
              Billing Hours
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              justifyContent: "end",
              marginRight: "25px",
              paddingTop: "20px",
            }}
          >
            <div className="">
              <Select
                options={projectOptions}
                placeholder="Select Project"
                onChange={handleProjectChange}
                value={selectedProject}
                className="drop_down_list"
                styles={customStyles}
                // isSearchable
              />
            </div>

            <div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                maxDate={new Date()}
                className="timesheet-datepicker"
                customInput={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>📅</span>
                    <span>
                      {selectedDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                }
              />
            </div>
          </div>
        </div>
        <div className="TimeSheet_Table" style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Role</th>
                <th style={{ textAlign: "center" }}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {ProjectEmployees.length > 0 ? (
                ProjectEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className="tablebody"
                    style={{
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <td>
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td>{employee.email}</td>
                    <td>{department}</td>
                    <td>
                      <span className="activeInactive">
                        {employee.employeeStatus ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {employee.role.name}
                    </td>
                    <td>
                      {getTimeSheet.length > 0 ? (
                        getTimeSheet
                          .filter((obj) => obj.employeeId === employee.id)
                          .map((filteredEmployee) => (
                            <div key={filteredEmployee.employeeId}>
                              {filteredEmployee.isSubmited === true ? (
                                <span
                                  style={{
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  {filteredEmployee.workingHourse}
                                </span>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <input
                                    type="text"
                                    className="timesheet_input form-control  "
                                    value={hours[employee.id] || ""}
                                    // value={filteredEmployee.workingHourse}
                                    placeholder="00:00  Hrs"
                                    onChange={(e) =>
                                      handleHoursChange(
                                        employee.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            type="text"
                            className="timesheet_input form-control "
                            d
                            placeholder="00:00  Hrs"
                            value={hours[employee.id] || ""}
                            onChange={(e) =>
                              handleHoursChange(employee.id, e.target.value)
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>

                  <td></td>
                  <td>No Records Found</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingBottom: "15px",
          }}
        >
          {!disiblebuttons && ProjectEmployees.length !== 0 && (
            <div>
              <button
                type="button"
                className="reset_button me-2"
                onClick={Resetfunction}
              >
                <span className="make_a_request_span"> reset</span>
              </button>

              <button
                type="button"
                className="save_button me-2"
                onClick={SaveForm}
              >
                <span className="make_a_request_span"> save</span>
              </button>

              <button
                type="button"
                className="submit_button me-2"
                onClick={SubmitFormFunction}
              >
                <span className="make_a_request_span"> Submit</span>
              </button>
            </div>
          )}
        </div>
        {disiblebuttons && (
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              paddingBottom: "15px",
            }}
          >
            <button
              type="button"
              className="submitbutton "
              style={{ marginRight: "10px" }}
            >
              <span className="make_a_request_span"> Make a request</span>
            </button>
            {/* <a href="#" className="" style={{ marginRight: "10px" }}>
              <span className="make_a_request_span"> Make a request</span>
            </a> */}
          </div>
        )}
      </div>
      {isOpen && (
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
            <h2 className="unique-popup-title">
              TimeSheet Saved Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setIsOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isSubmitOpen && (
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
            <h2 className="unique-popup-title">
              TimeSheet Submitted Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setIssubmitOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

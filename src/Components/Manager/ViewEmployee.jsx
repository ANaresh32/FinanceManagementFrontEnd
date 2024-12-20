import React from "react";
import { useEffect, useState } from "react";
import ManagerService from "../../Service/ManagerService/ManagerService";
import "../../assets/Styles/ViewEmployee.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export default function ViewEmployee() {
  const [employee, setEmployee] = useState({});
  const [roleName, setRoleName] = useState("");
  const id = localStorage.getItem("empId");
  const navigate = useNavigate();
  useEffect(() => {
    FetchData();
  }, []);
  async function FetchData() {
    var response = await ManagerService.FcnGetEmployee(id);
    setEmployee(response.item);
    setRoleName(response.item.role.name);
  }

  function backonclick(e) {
    e.preventDefault();
    navigate("/UnderManagerEmployees");
  }

  return (
    <div>
      <div className="d-flex">
        <div>
          <IoArrowBackCircle
            style={{ cursor: "pointer", fontSize: "28px", color: "black" }}
            onClick={backonclick}
          />
        </div>
        <p className="mt-1" style={{ fontSize: "1rem" }}>
          Back
        </p>
      </div>
      <div className="card" style={{ borderRadius: "0px" }}>
        <div>
          <p className="viewemployeecontent">Employee Details</p>
        </div>
        <div className="view-employee-card">
          <div className="view-employee-content">
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Employee ID:</div>
              <div className="col-3 view-employee-value">
                {employee.employeeId}
              </div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Name:</div>
              <div className="col-3 view-employee-value">
                {employee.firstName} {employee.lastName}
              </div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Email:</div>
              <div className="col-3 view-employee-value">{employee.email}</div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row"></div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Phone:</div>
              <div className="col-3 view-employee-value">
                {employee.mobileNo}
              </div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Date of Joining:</div>
              <div className="col-3 view-employee-value">
                {employee.dateOfJoining}
              </div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Status:</div>
              <div className="col-3 view-employee-value">
                {employee.employeeStatus == 1 ? <p>Active</p> : <p>InActive</p>}
              </div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">Role:</div>
              <div className="col-3 view-employee-value">{roleName}</div>
              <div className="col-6 view-employee-value"></div>
            </div>
            <div className="row view-employee-row">
              <div className="col-3 view-employee-label">skillSets:</div>
              <div className="col-3 view-employee-value">
                {employee.skillSets == "" ? (
                  <p>N/A</p>
                ) : (
                  <p> {employee.skillSets}</p>
                )}
              </div>
              <div className="col-6 view-employee-value"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import ManagerService from "../../Service/ManagerService/ManagerService";
import "../../../src/assets/Styles/UnderManagerEmployees.css";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UnderManagerEmployees() {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    FetchData();
  }, []);
  async function FetchData() {
    var id = userDetails.employee.id;
    var response = await ManagerService.FcnUn;

    derManagerEmployees(id);

    setEmployees(response.item);
  }
  function employeeDetaails(id) {
    console.log(id, "------------->");
    localStorage.setItem("empId", id);
    navigate("/ViewEmployee");
  }

  return (
    <div>
      <div className="card" style={{ borderRadius: "0px" }}>
        <div className="employeecontent">Employees</div>
        <div>
          <table className="table table-striped table-hover mt-4">
            <thead>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Employee ID
              </th>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Name
              </th>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Email ID
              </th>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Mobile Number
              </th>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Date Of Joining
              </th>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Status
              </th>
              <th style={{ backgroundColor: "#196e8a", color: "white" }}>
                Role
              </th>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No records in the table
                  </td>
                </tr>
              ) : (
                employees.map((obj, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => employeeDetaails(obj.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="">
                        <Link>
                          <p style={{ color: "blue", cursor: "pointer" }}>
                            {obj.employeeId}
                          </p>
                        </Link>
                      </td>
                      <td className="">{`${obj.firstName}   ${obj.lastName}`}</td>
                      <td className="">{obj.email}</td>
                      <td>{obj.mobileNo}</td>
                      <td>
                        {new Date(obj.dateOfJoining).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      {obj.employeeStatus == 1 ? (
                        <td>
                          <p
                            style={{
                              backgroundColor: "#196e8a",
                              textAlign: "center",
                              color: "white",
                            }}
                          >
                            Active
                          </p>
                        </td>
                      ) : (
                        <td>
                          <p
                            style={{
                              backgroundColor: "red",
                              textAlign: "center",
                              color: "white",
                            }}
                          >
                            InActive
                          </p>
                        </td>
                      )}
                      <td>{obj.role.name}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

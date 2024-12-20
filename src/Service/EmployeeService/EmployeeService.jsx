import axios from "axios";
const EmployeeService = {
  async FcnGetProjectMangerProjects(id) {
    const response = await axios.get(
      `https://localhost:44305/api/EmployeeProjects/GetProjectManagerProjects?id=${id}`
    );
    return response.data;
  },
  async GetProjectInfo(id) {
    const response = await axios.get(
      `https://localhost:44305/api/EmployeeProjects/GetAllProjectInfo?projectManagerid=${id}`
    );
    return response.data;
  },
  async GetEmployeefcn(empId) {
    const response = await axios.get(
      `https://localhost:44305/api/Employees/GetEmployeeDetails?id=${empId}`
    );

    return response.data;
  },
  async GetprojectEmployees(id, formattedDate) {
    console.log(id, formattedDate, "in servvice");
    const response = await axios.post(
      `https://localhost:44305/api/Timesheets/GetProjectEmployee?projectID=${id}&date=${formattedDate}`
    );

    return response.data;
  },
  async UpdateProfilefcn(obj) {
    const response = await axios.post(
      `https://localhost:44305/api/Employees/UpdateProfile`,
      obj
    );

    return response.data;
  },
};
export default EmployeeService;

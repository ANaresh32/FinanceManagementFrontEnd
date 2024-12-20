import axios from "axios";
const TimeSheetService = {
  async AddNewTimeSheet(obj, projectManagerid, isSubmited) {
    const response = await axios.post(
      `https://localhost:44305/api/Timesheets/AddtimeSheet?selectedDate=${obj.selectedDate}&projectId=${obj.projectId}&projectManager=${projectManagerid}&isSubmited=${isSubmited}`,
      obj.employeeData
    );

    return response.data;
  },
  async GetTimeSheetDeatils(month, projectId) {
    const response = await axios.post(
      `https://localhost:44305/api/Timesheets/GetTimeSheetEmployees?month=${month}&projectId=${projectId}`
    );

    return response.data;
  },
};
export default TimeSheetService;

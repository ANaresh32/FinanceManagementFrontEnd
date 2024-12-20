import axios from "axios";
import "../../assets/Styles/EmployeePages/AdminDashboard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import DatePicker from "react-datepicker";
import AddEmployeeQuickAction from "../../../src/assets/Images/QuickActions1.png";
import AddProjectQuickAction from "../../../src/assets/Images/QuickActions2.png";
import ProjectUpdateImage from "../../../src/assets/Images/ProjectupdateImage.png";
import Manageroles from "../../../src/assets/Images/QuickActions3.png";
import "react-datepicker/dist/react-datepicker.css";
import UpdateProjectImahe from "../../../src/assets/Images/ProjectUpdateBackUp.png";
import RecentEmployeeImage from "../../../src/assets/Images/AddEmployeeimage.png";
import TeamMemberAddedImage from "../../../src/assets/Images/TeamMemberAdded.png";
import rupee from "../../../src/assets/Images/Rupee.png";
import abcprojectimage from "../../../src/assets/Images/AbcProjectImage.png";
// import Dropdown from "react-bootstrap/Dropdown";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [TotalEmployees, setTotalEmployees] = useState(0);
  const [TotalbenchEmployees, setTotalBenchEmployees] = useState(0);
  const [BillaBleEmployees, setBillbleEmployees] = useState(0);
  const [TotalProject, setTotalProjects] = useState(0);
  const totalEmployees = TotalEmployees;
  const billable = BillaBleEmployees;
  const nonBillable = TotalbenchEmployees;
  const total = billable + nonBillable;
  // const billablePercentage = total > 0 ? (billable / total) * 100 : 0;
  // const nonBillablePercentage = total > 0 ? (nonBillable / total) * 100 : 0;
  const billablePercentage = (billable / totalEmployees) * 100;
  const nonBillablePercentage = (nonBillable / totalEmployees) * 100;
  const totalBench = TotalbenchEmployees;
  const internal = 0;
  const noProjects = TotalProject;
  const internalPercentage = (internal / totalBench) * 100;
  const noProjectsPercentage = (noProjects / totalBench) * 100;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  useEffect(() => {
    FetchData();
  }, []);
  const FetchData = async () => {
    var response = await axios.get(
      "https://localhost:44305/api/Employees/TotalEmployees"
    );
    var resuult = response.data;
    if (resuult.isSuccess) {
      setTotalEmployees(resuult.item.item1);
      setTotalBenchEmployees(resuult.item.item2);
      setBillbleEmployees(resuult.item.item3);
      setTotalProjects(resuult.item.item4);
    }
  };
  const data = {
    labels: ["In Progress", "Completed", "Not Started"],
    datasets: [
      {
        data: [40, 30, 30], // Example percentages
        backgroundColor: ["#007BFF", "#00CFFF", "#E0E0E0"], // Colors matching the design
        hoverBackgroundColor: ["#0056b3", "#0099cc", "#c6c6c6"], // Hover colors
        borderWidth: 0, // Removes border lines
      },
    ],
  };

  const options = {
    cutout: "70%", // Controls the thickness of the doughnut
    plugins: {
      legend: {
        display: false, // Hides default legend
      },
    },
  };
  // ================Pending Projects
  const data1 = {
    labels: ["Planning", "Designing", "Pre Construction"],
    datasets: [
      {
        data: [20, 30, 40, 30], // Example percentages
        backgroundColor: ["red", "#007BFF", "#8AB4F8", "#E0E0E0"], // Match colors in your design
        hoverBackgroundColor: ["red", "#0056b3", "#6a9ee0", "#c6c6c6"],
        borderWidth: 0, // Remove border lines
      },
    ],
  };

  const options1 = {
    cutout: "70%", // Controls the thickness of the chart
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
    },
  };
  // ================profitandlossgraphs
  const data2 = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Profit And Loss",
        backgroundColor: "#f87979",
        data: [40, 20, 12, 39, 10, 40, 39],
      },
    ],
  };

  const options2 = {
    plugins: {
      legend: {
        labels: {
          color:
            getComputedStyle(document.body).getPropertyValue(
              "--cui-body-color"
            ) || "#000",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color:
            getComputedStyle(document.body).getPropertyValue(
              "--cui-border-color-translucent"
            ) || "#ddd",
        },
        ticks: {
          color:
            getComputedStyle(document.body).getPropertyValue(
              "--cui-body-color"
            ) || "#000",
        },
      },
      y: {
        grid: {
          color:
            getComputedStyle(document.body).getPropertyValue(
              "--cui-border-color-translucent"
            ) || "#ddd",
        },
        ticks: {
          color:
            getComputedStyle(document.body).getPropertyValue(
              "--cui-body-color"
            ) || "#000",
        },
      },
    },
  };
  // ====================graph
  const data3 = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [5, 10, 15, 10, 20, 25, 8, 20, 15, 10, 5, 2], // No label
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`, // Show only the value in the tooltip
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}%`, // Add '%' to Y-axis values
        },
      },
    },
  };
  const NavigateToAddEmployee = () => {
    navigate("/dashboard/AddEmployee");
  };
  const NavigateToAddProject = () => {
    navigate("/dashboard/AddProject");
  };
  const NavigateToAddManageRoles = () => {
    navigate("/dashboard/roles");
  };
  const data11 = {
    labels: ["Planning", "Designing", "Pre-Construction"],
    datasets: [
      {
        data: [30, 40, 30], // Values for each section
        backgroundColor: ["#000000", "#7FB3D5", "#E5E5E5"], // Section colors
        borderWidth: 0, // Removes border between sections
        cutout: "75%", // Inner circle size
      },
    ],
  };

  const options11 = {
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    rotation: 225, // Rotate the chart to align properly
    circumference: 270, // Draws 3/4th of a circle
  };
  return (
    <div className="DashboardMaindiv">
      <p className="employeeoveriew_content">Employee Overview</p>

      <div className="row m-0">
        <div className="col-4 Employeeoverview " style={{ width: "32%" }}>
          <p className="ActiveEmployeeContent mt-2">Active Employees</p>
          <div style={{ position: "relative", width: "200px" }}>
            <svg width="100" height="50">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#F5F5F5"
                strokeWidth="8"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#4A90E2"
                strokeWidth="8"
                strokeDasharray={`${billablePercentage}, 100`}
              />

              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#F5A623"
                strokeWidth="8"
                strokeDasharray={`${nonBillablePercentage}, 100`}
                strokeDashoffset={-billablePercentage}
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: " 83%",
                left: " 48%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <h5 style={{ marginRight: "97px", fontSize: "20px" }}>
                {totalEmployees}
              </h5>
            </div>
            <div
              style={{
                position: "absolute",
                top: "130%",
                left: "24%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <small className="total_employees_content">Total Employees</small>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "68%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "19px",
                    backgroundColor: "#4A90E2",
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                ></div>
                <span className="billble_content">{billable} Billable</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "5px",
                    height: "19px",
                    backgroundColor: "#F5A623",
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                ></div>
                <span className="billble_content">
                  {nonBillable} Non-Billable
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-4 Employeeoverview "
          style={{ width: "32%", marginLeft: "16px" }}
        >
          <div className="mt-2">
            <p className="ActiveEmployeeContent">Employees on Bench</p>

            <div
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
              }}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 36 36"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#F5F5F5"
                  strokeWidth="2"
                />

                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#4A90E2"
                  strokeWidth="2"
                  strokeDasharray={`${internalPercentage} ${
                    100 - internalPercentage
                  }`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#D3D3D3"
                  strokeWidth="2"
                  strokeDasharray={`${noProjectsPercentage} ${
                    100 - noProjectsPercentage
                  }`}
                  strokeDashoffset={`-${internalPercentage}`}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "26%",
                  left: " 39%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  padding: "0",
                  margin: "0",
                }}
              >
                <small className="bench_Employee-Progress">{totalBench}</small>
              </div>
              <span
                className="total_employees_content "
                style={{
                  position: "absolute",
                  top: "40%",
                  left: " 39%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  // padding: "0",
                  // margin: "0",
                }}
              >
                Bench
              </span>
              <span
                className="total_employees_content"
                style={{
                  position: "absolute",
                  top: "52%",
                  left: " 39%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  // padding: "0",
                  // margin: "0",
                }}
              >
                Employees
              </span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: " 70%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "19px",
                  backgroundColor: "#4A90E2",
                  marginRight: "5px",
                  borderRadius: "5px",
                }}
              ></div>
              <span className="billble_content ms-2">{internal} Internal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "5px",
                  height: "19px",
                  backgroundColor: "#D3D3D3",
                  borderRadius: "5px",
                }}
              ></div>
              <span className="billble_content ms-2">
                {noProjects} No Projects
              </span>
            </div>
          </div>
        </div>
        <div
          className="col-4 Employeeoverview "
          style={{ width: "32%", marginLeft: "16px" }}
        >
          <div className="mt-2">
            <p className="ActiveEmployeeContent"> Total Employees</p>
          </div>
          <div
            className="total_employee_content"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 18px",
            }}
          >
            <span style={{ fontSize: "20px" }} className="lastrowcontent">
              {totalEmployees}
            </span>
            <span style={{ fontSize: "13px" }} className="lastrowcontent">
              Active Employees
            </span>
          </div>
          <div
            className="total_employee_content1"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 18px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "20px" }} className="lastrowcontent">
              {totalBench}
            </span>
            <span style={{ fontSize: "13px" }} className="lastrowcontent">
              Employees on bench
            </span>
          </div>
        </div>
      </div>

      <div className="Project_OverView">
        <p className="projectOverview_content">Project Overview</p>
        <div className="row m-0">
          <div className="Project_progress col-4" style={{ width: "32%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="Active_project_conetnt">Active Projects</span>
              <i
                class="bi bi-three-dots"
                style={{
                  color: "#989898",
                  fontSize: "24px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              ></i>
            </div>

            <div
              style={{
                width: "145px",
                textAlign: "center",
                margin: "0",
                position: "relative",
                marginLeft: "79px",
                marginTop: "17px",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  position: "absolute",
                  top: "45%",
                  fontSize: "12px",
                  left: "22%",
                }}
                className="activeEmployees"
              >
                Active Projects
              </p>
              <Doughnut data={data} options={options} />
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#007BFF",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  style={{ fontSize: "12px" }}
                  className="ActiveProject_Inprogress_notstated"
                >
                  In Progress
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#00CFFF",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  style={{ fontSize: "12px" }}
                  className="ActiveProject_Inprogress_notstated"
                >
                  Completed
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#E0E0E0",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  style={{ fontSize: "12px" }}
                  className="ActiveProject_Inprogress_notstated"
                >
                  Not Started
                </span>
              </div>
            </div>
          </div>
          <div
            className="Project_progress col-4"
            style={{ width: "32%", marginLeft: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="Active_project_conetnt">Pending Projects</span>
              <i
                class="bi bi-three-dots"
                style={{
                  color: "#989898",
                  fontSize: "24px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              ></i>
            </div>

            <div
              style={{
                width: "145px",
                textAlign: "center",
                margin: "0",
                position: "relative",
                marginLeft: "79px",
                marginTop: "17px",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  position: "absolute",
                  top: "45%",
                  fontSize: "12px",
                  left: "22%",
                }}
                className="activeEmployees"
              >
                Active Projects
              </p>
              <Doughnut data={data1} options={options1} />
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#007BFF",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  style={{ fontSize: "12px" }}
                  className="ActiveProject_Inprogress_notstated"
                >
                  Planning
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#00CFFF",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  style={{ fontSize: "12px" }}
                  className="ActiveProject_Inprogress_notstated"
                >
                  Designing
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#E0E0E0",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  style={{ fontSize: "12px" }}
                  className="ActiveProject_Inprogress_notstated"
                >
                  Pre Construction
                </span>
              </div>
            </div>
          </div>
          <div
            className="Project_progress col-4"
            style={{ width: "32%", marginLeft: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="Active_project_conetnt">Completed Projects</span>
              <i
                class="bi bi-three-dots"
                style={{
                  color: "#989898",
                  fontSize: "24px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              ></i>
            </div>
            <div
              style={{
                width: "145px",
                textAlign: "center",
                margin: "0",
                position: "relative",
                marginLeft: "79px",
                marginTop: "17px",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  position: "absolute",
                  top: "45%",
                  fontSize: "12px",
                  left: "22%",
                }}
                className="activeEmployees"
              >
                Active Projects
              </p>
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
      <div className="Profit_And_Loss_Summary">
        <div className="row ">
          <div className="col-8">
            <span className="projectOverview_content">
              Profit And loss Summary
            </span>

            <div className="Profit_and_loss_flowchat mt-3">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 20px",
                }}
              >
                <span className="adminName">loreum lpsum</span>
                <i
                  class="bi bi-three-dots"
                  style={{
                    color: "#989898",
                    fontSize: "24px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                ></i>
              </div>
              <div
                style={{
                  width: "80%",
                  margin: "auto",
                  padding: "20px",
                  marginTop: "20px",
                  border: "1px solid",
                  paddingTop: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      border: "1px solid #eaeaea",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="MMM dd"
                      placeholderText="Select a date"
                      style={{ border: "none!impartant" }}
                    />
                  </div>
                </div>
                <Bar data={data3} options={options3} />
              </div>
            </div>
          </div>
          <div className="col-4">
            <span className="projectOverview_content ">Recent Activities</span>
            <div className="recentActivities mt-3">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 20px",
                }}
              >
                <span className="adminName">Latest update</span>
                <i
                  class="bi bi-three-dots"
                  style={{
                    color: "#989898",
                    fontSize: "24px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                ></i>
              </div>
              <div
                className="latest_updatesImage row"
                //style={{ padding: "10px" }}
              >
                <div className="row m-0">
                  <div className="col-2">
                    <div
                      style={{
                        height: "40px",
                        width: "40px",
                        backgroundColor: " #875fc0",
                        borderRadius: "100px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={UpdateProjectImahe}
                        alt=""
                        style={{
                          position: "absolute",
                          top: "25%",
                          left: "25%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-7">
                    <span className="Project_Updated_Span">
                      Project Updated
                    </span>
                    <div style={{ display: "flex" }}>
                      <span className="project_updated_name">Naresh</span>
                      <span className="updated_task_content  ms-2">
                        updated a task
                      </span>
                    </div>
                  </div>
                  <div className="col-3  p-0">
                    <span className="updated_time" style={{ fontSize: "10px" }}>
                      45 minutes ago
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="latest_updatesImage row mt-4"
                //style={{ padding: "10px" }}
              >
                <div className="row m-0">
                  <div className="col-2">
                    <div
                    // style={{
                    //   height: "40px",
                    //   width: "40px",
                    //   backgroundColor: " #875fc0",
                    //   borderRadius: "100px",
                    //   position: "relative",
                    // }}
                    >
                      <img
                        src={RecentEmployeeImage}
                        alt=""
                        height="40px"
                        width="40px"
                      />
                    </div>
                  </div>
                  <div className="col-7">
                    <span className="Project_Updated_Span">
                      Added new Employee
                    </span>
                    <div style={{ display: "flex" }}>
                      <span className="project_updated_name">Nagaraju</span>
                      <span className="updated_task_content ms-2 ">
                        updated a task
                      </span>
                    </div>
                  </div>
                  <div className="col-3 p-0 ">
                    <span className="updated_time" style={{ fontSize: "10px" }}>
                      45 minutes ago
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="latest_updatesImage row mt-4"
                //style={{ padding: "10px" }}
              >
                <div className="row m-0">
                  <div className="col-2">
                    <div
                      style={{
                        height: "40px",
                        width: "40px",
                        backgroundColor: "#45C4F4",
                        borderRadius: "100px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={TeamMemberAddedImage}
                        alt=""
                        style={{
                          position: "absolute",
                          top: "25%",
                          left: "25%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-7">
                    <span className="Project_Updated_Span">
                      Team member added
                    </span>
                    <div style={{ display: "flex" }}>
                      <span className="project_updated_name">Mohasina</span>
                      <span className="updated_task_content  ms-2">
                        updated a task
                      </span>
                    </div>
                  </div>
                  <div className="col-3  p-0">
                    <span className="updated_time" style={{ fontSize: "10px" }}>
                      45 minutes ago
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="latest_updatesImage row mt-4"
                //style={{ padding: "10px" }}
              >
                <div className="row m-0">
                  <div className="col-2">
                    <div
                      style={{
                        height: "40px",
                        width: "40px",
                        backgroundColor: "#FFB82C",
                        borderRadius: "100px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={rupee}
                        alt=""
                        style={{
                          position: "absolute",
                          top: "25%",
                          left: "25%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-7">
                    <span className="Project_Updated_Span">
                      Payroll rolled out
                    </span>
                    <div style={{ display: "flex" }}>
                      <span className="project_updated_name">Nagaraju</span>
                      <span className="updated_task_content ms-2 ">
                        updated a task
                      </span>
                    </div>
                  </div>
                  <div className="col-3 p-0 ">
                    <span className="updated_time" style={{ fontSize: "10px" }}>
                      45 minutes ago
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="latest_updatesImage row mt-4"
                //style={{ padding: "10px" }}
              >
                <div className="row m-0">
                  <div className="col-2">
                    <div
                      style={{
                        height: "40px",
                        width: "40px",
                        backgroundColor: "#46F24B",
                        borderRadius: "100px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={abcprojectimage}
                        alt=""
                        style={{
                          position: "absolute",
                          top: "25%",
                          left: "25%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-7">
                    <span className="Project_Updated_Span">
                      Abc project completed
                    </span>
                    <div style={{ display: "flex" }}>
                      <span className="project_updated_name">Saiomkar</span>
                      <span className="updated_task_content ms-2">
                        updated a task
                      </span>
                    </div>
                  </div>
                  <div className="col-3 p-0">
                    <span className="updated_time" style={{ fontSize: "10px" }}>
                      45 minutes ago
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  border: "1px solid #64646430",
                  width: "85%",
                }}
                className="ms-4 mt-3"
              ></div>
              <div className="viewAlldiv">
                <span className="ViewAll">
                  View All
                  <i
                    class="bi bi-arrow-right ms-1"
                    height="12px"
                    width="12px"
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: "30px" }}>
        <div style={{ paddingBottom: "20px" }}>
          <span className="projectOverview_content">Quick Actions</span>
        </div>
        <div
          className="Quick_Actions_div"
          style={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            alignContent: "center",
          }}
        >
          <div
            className="addEmployee_quick_action"
            onClick={NavigateToAddEmployee}
          >
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AddEmployeeQuickAction}
                  alt=""
                  height="52px"
                  width="52px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Add Employee</span>
              </div>
            </div>
          </div>
          <div
            className="addEmployee_quick_action"
            onClick={NavigateToAddProject}
          >
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AddProjectQuickAction}
                  alt=""
                  height="52px"
                  width="52px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Add Project</span>
              </div>
            </div>
          </div>
          <div
            className="addEmployee_quick_action"
            onClick={NavigateToAddManageRoles}
          >
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={Manageroles} alt="" height="52px" width="52px" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Manage Roles</span>
              </div>
            </div>
          </div>
          <div className="addEmployee_quick_action">
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AddEmployeeQuickAction}
                  alt=""
                  height="52px"
                  width="52px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Add Employee</span>
              </div>
            </div>
          </div>
          <div className="addEmployee_quick_action">
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AddEmployeeQuickAction}
                  alt=""
                  height="52px"
                  width="52px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Add Employee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

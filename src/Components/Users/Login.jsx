import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "../../assets/Styles/Login.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons
import { setSessionData } from "../../Service/SharedSessionData";
import { ControlCameraSharp } from "@mui/icons-material";
import { LoginFormValidation } from "../Admin/Pages/LoginFormValidation";
import { getotpValidation } from "./getotpValidation";
import loginLogo from "../../../src/assets/Images/loginbg1.png";
import archetslogo from "../../../src/assets/Images/primary-logo.png";
import rememeberme from "../../assets/Images/checkbox.svg";
const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login"); // 'login', 'resetPassword', 'verifyOtp', 'setNewPassword'
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();
  const [emailvalues, setEmialValuess] = useState({
    email: "",
  });
  const [emailerror, setEmialerror] = useState({
    email: "",
  });
  const [valuess, setValuess] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const navigatetoforgotpasswordpage = async () => {
    debugger;
    navigate("/user/forgotpassword");
  };
  const onLoginButtonClick = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: LoginFormValidation("email", valuess.email),
      password: LoginFormValidation("password", valuess.password),
    };

    setError(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      var obj = {
        Email: valuess.email,
        Password: valuess.password,
      };

      var responses = await axios.post(
        "https://localhost:44305/api/Login/login",
        obj
      );
      var result = await responses.data;
      localStorage.setItem("sessionData", JSON.stringify(result.item));
      setLoggedIn(true); // Update logged-in state
      if (result.isSuccess === true) {
        setLoggedIn(true);
        setSessionData(result.item);
        debugger;
        if (result.item.employee.role.name === "US-Finance") {
          navigate("/USFinance/UsFinaceALlProjects");
        } else if (result.item.employee.role.name === "Admin") {
          navigate("/dashboard/AdminDashboard");
        } else if (result.item.employee.role.name === "Indian finace") {
          navigate("/EmployeeDashboard");
        } else if (result.item.employee.role.name === "Project Manager") {
          navigate("/dashboard/ManagerDasboard");
        } else if (result.item.employee.role.name === "Reporting Manager") {
          navigate("/UnderManagerEmployees");
        } else if (result.item.employee.role.name === "Hr") {
          navigate("/EmployeeDashboard");
        }
        //navigate("/AdminDashboard"); // Navigate to dashboard or another page
      } else {
        // Handle specific error codes
        if (result.error.code === "AUTH001") {
          toast.error("Email not found. Please check your email address.", {
            position: "top-right",
            autoClose: 4000,
          });
        } else if (result.error.code === "AUTH002") {
          toast.error(
            "Incorrect password. Please check your password and try again.",
            { position: "top-right", autoClose: 4000 }
          );
        } else {
          // Generic error message for other cases
          toast.error("Check your email and password.", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }
    }
  };

  const [values, setValues] = useState({
    Email: "",
  });

  async function getotpfunction(e) {
    e.preventDefault();
    const newErrors = {
      email: getotpValidation("email", emailvalues.email),
    };
    setEmialerror(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      var obj = {
        Email: emailvalues.email,
      };
      var responses = await axios.post(
        "https://localhost:44305/api/Auth/get-otp",
        obj
      );
      var result = await responses.data;
      if (result.isSuccess) {
        toast.success("OTP sent successfully to Your Email.", {
          position: "top-right",
          autoClose: 4000,
        });
        setView("verifyOtp");
      } else {
        toast.error("Please enter a valid email.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  }

  const [otpValues, setOtpValues] = useState({
    Otp: "",
  });
  const [otpErrors, setOtpErrors] = useState({
    Otp: "",
  });

  const handleOtpChange = (e) => {
    const { name, value } = e.target;

    setOtpValues({
      ...otpValues,
      [name]: value,
    });
    setOtpErrors({
      ...otpErrors,
      [name]: validateOtp(name, value),
    });
  };

  async function onVerifyOtpClick(e) {
    e.preventDefault();
    const newErrors = {
      Otp: validateOtp("Otp", otpValues.Otp),
    };
    setOtpErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (!isValid) {
      var obj = { Email: values.Email, Otp: otpValues.Otp };
      var responses = await axios.post(
        "https://localhost:44305/api/Auth/verify-otp",
        obj
      );
      var result = await responses.data;
      if (result.isSuccess) {
        toast.success("OTP verified successfully.", {
          position: "top-right",
          autoClose: 4000,
        });
        setView("setNewPassword");
      } else {
        toast.error("Invalid OTP. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  }

  function validateOtp(name, value) {
    if (name === "Otp") {
      if (!value) return "OTP is required";
      // if (!/^\d{6}$/.test(value)) return "OTP is invalid";
    }
  }

  // New password validation and handlers
  const [passwordValues, setPasswordValues] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordValues({
      ...passwordValues,
      [name]: value,
    });
    setPasswordErrors({
      ...passwordErrors,
      [name]: validatePassword(name, value),
    });
  };
  const handleChange22 = async (e) => {
    const { name, value } = e.target;

    setEmialValuess({
      ...emailvalues,
      [name]: value,
    });

    setEmialerror({
      ...error,
      [name]: getotpValidation(name, value),
    });
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setValuess({
      ...valuess,
      [name]: value,
    });

    setError({
      ...error,
      [name]: LoginFormValidation(name, value),
    });
  };
  async function onSetNewPasswordClick(e) {
    e.preventDefault();

    const newErrors = {
      NewPassword: validatePassword("NewPassword", passwordValues.NewPassword),
      ConfirmPassword: validatePassword(
        "ConfirmPassword",
        passwordValues.ConfirmPassword
      ),
    };
    setPasswordErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (!isValid) {
      var obj = {
        Email: values.Email,
        Otp: otpValues.Otp,
        NewPassword: passwordValues.NewPassword,
      };

      var responses = await axios.post(
        "https://localhost:44305/api/Auth/update-password",
        obj
      );
      var result = responses.data;
      if (result.isSuccess) {
        toast.success("Password updated successfully.", {
          position: "top-right",
          autoClose: 4000,
        });
        setView("login");
      } else {
        // Handle specific error codes
        if (result.error.code === "AUTH003") {
          toast.error(
            "New password cannot be the same as the existing password.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        } else {
          toast.error("Failed to update password. Please try again.", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }
    }
  }

  function validatePassword(name, value) {
    if (name === "NewPassword") {
      if (!value) return "New password is required";
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
      )
        return "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character";
    }
    if (name === "ConfirmPassword") {
      if (!value) return "Confirm password is required";
      if (value !== passwordValues.NewPassword) return "Passwords should match";
    }
  }

  return (
    <div className="maindiv" style={{ display: "flex" }}>
      <div className="imagediv">
        <img src={loginLogo} alt="" className="Loginimagelogo" />
      </div>
      <div className="formdiv">
        <div className="formdiv1">
          <div className="" style={{ marginTop: "39px" }}>
            <img src={archetslogo} alt="" className="archentslogo" />
          </div>
          <div className="logincontent">Login</div>
          <div className="financecontent">Welcome to Finance Management !</div>
          <div className="pleaseLoginContent">
            Please login using email id and password
          </div>
          <div className="inputdiv">
            <div>
              <div>
                <label>
                  Email ID <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="enter your username"
                className="emailandpassword"
                name="email"
                value={valuess.email}
                onChange={handleChange}
              />
              {error.email && (
                <span
                  className="error ms-1 emailrequirederrormessage "
                  style={{ color: "red", textAlign: "start", display: "flex" }}
                >
                  {error.email}
                </span>
              )}
            </div>
            <div className="mt-4">
              <div>
                <label>
                  Password <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <input
                //type="password"
                type={showPassword ? "text" : "password"}
                className="emailandpassword"
                placeholder="enter your username"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <div
                className="eyeIcon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {error.password && (
              <span
                className="ms-1 emailrequirederrormessage"
                style={{ color: "red", textAlign: "start", display: "flex" }}
              >
                {error.password}
              </span>
            )}
          </div>
          <div
            className="forgotpasswordtag mt-1"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex" }}>
              <img src={rememeberme} alt="" />
              <p className="remembermecontent m-2">Remember me</p>
            </div>
            <div className="mt-2">
              <a
                className="forgotpasswordatag"
                onClick={navigatetoforgotpasswordpage}
                style={{ color: "#0071FF", cursor: "pointer" }}
              >
                Forgot Password?
              </a>
            </div>
          </div>
          <div className="loginbutton">
            <button className="buttonlogin" onClick={onLoginButtonClick}>
              Login
            </button>
          </div>
          <div className="forcontect">
            if you are a new user, please contact archents support team.
          </div>
        </div>
      </div>
      <ToastContainer position="top-end" autoClose={5000} />
    </div>
  );
};

export default Home;

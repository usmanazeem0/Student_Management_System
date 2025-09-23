import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/,
          "Email must be valid"
        )
        .test(
          "no-spaces-around",
          "Spaces before or after email are not allowed",
          (value) => value === value?.trim()
        )
        .required("Email is required"),
      password: Yup.string().required("Password required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await axios.post(
          "http://localhost:5000/teacher/login",
          values
        );
        // Save teacher email after successful login
        localStorage.setItem("token", res.data.token);

        toast.success("login successfull");
        setTimeout(() => {
          resetForm();
          navigate("/dashboard");
          setSubmitting(false);
        }, 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-box" role="main">
        <h2>Login</h2>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              {...formik.getFieldProps("email")}
              aria-invalid={formik.touched.email && !!formik.errors.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}
          </div>

          {/* Password */}
          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...formik.getFieldProps("password")}
                aria-invalid={
                  formik.touched.password && !!formik.errors.password
                }
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
          </div>

          {/* Submit */}
          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="already-account">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

// import React, { useState } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { ToastContainer, toast } from "react-toastify";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import { useNavigate, Link } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "./login.css";

// export default function Login() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false); //  added state

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid Email").required("email required"),
//       password: Yup.string().required("password required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       //  corrected resetForm
//       try {
//         const res = await axios.post(
//           "http://localhost:5000/api/auth/login",
//           values
//         );
//         toast.success(res.data.message);
//         resetForm();
//         navigate("/dashboard");
//       } catch (error) {
//         toast.error(error.response?.data?.message || "login failed");
//       }
//     },
//   });

//   return (
//     <div className="login-container">
//       <div className="login-box" role="main">
//         <h2>Login</h2>

//         <form onSubmit={formik.handleSubmit} noValidate>
//           {/* Email */}
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter Email"
//               {...formik.getFieldProps("email")}
//               aria-invalid={formik.touched.email && !!formik.errors.email}
//             />
//             {formik.touched.email && formik.errors.email ? (
//               <div className="error-message">{formik.errors.email}</div>
//             ) : null}
//           </div>

//           {/* Password with show/hide */}
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <div className="password-input-wrapper">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter Password"
//                 {...formik.getFieldProps("password")}
//                 aria-invalid={
//                   formik.touched.password && !!formik.errors.password
//                 }
//               />

//               <button
//                 type="button"
//                 className="password-toggle"
//                 onClick={() => setShowPassword((s) => !s)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 title={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//               </button>
//             </div>

//             {formik.touched.password && formik.errors.password ? (
//               <div className="error-message">{formik.errors.password}</div>
//             ) : null}
//           </div>

//           <button type="submit" disabled={formik.isSubmitting}>
//             {formik.isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="already-account">
//           Don’t have an account? <Link to="/signup">Signup</Link>
//         </p>
//       </div>

//       {/* Toasts */}
//       <ToastContainer />
//     </div>
//   );
// }

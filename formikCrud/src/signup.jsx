import axios from "axios";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // eye icons
import { Link, Navigate, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
export default function Signup() {
  const navigate = useNavigate();

  // states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First Name must be at least 3 characters")
        .matches(
          /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/,
          "Name should not contain number special character and spaces"
        )
        .required("first Name is required"),

      //last name

      lastName: Yup.string()
        .min(3, "last Name must be at least 3 characters")
        .matches(
          /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/,
          "last Name should not contain number or special character or spaces"
        )
        .required("last Name is required"),

      //email

      email: Yup.string()
        .matches(
          /^(?!\s)([A-Za-z0-9._%+-]+)@(gmail\.com|yahoo\.com|hotmail\.com)(?!\s)$/,
          "email should be valid"
        )
        .email("Invalid email format")
        .required("Email is required"),

      //password

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[0-9]/, "Password must contain a number")
        .matches(/[A-Z]/, "Password must contain an uppercase letter")
        .matches(/[!@#$%^&*]/, "Password must contain a special character")
        .required("Password is required"),

      //confirm Password

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/teacher/signup",
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          }
        );
        console.log(response.data);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        resetForm();
        // Navigate to login page after 3s
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response?.data?.message || "Signup failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Signup</h2>
        {/* first Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            {...formik.getFieldProps("firstName")}
          />

          {formik.touched.firstName && formik.errors.firstName ? (
            <p className="error">{formik.errors.firstName}</p>
          ) : null}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <p className="error">{formik.errors.lastName}</p>
          ) : null}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...formik.getFieldProps("email")} />
          {formik.touched.email && formik.errors.email ? (
            <p className="error">{formik.errors.email}</p>
          ) : null}
        </div>
        {/* Password */}
        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...formik.getFieldProps("password")}
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <p className="error">{formik.errors.password}</p>
          ) : null}
        </div>
        {/* Confirm Password */}
        <div className="form-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
            />

            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="error">{formik.errors.confirmPassword}</p>
          ) : null}
        </div>
        {/* Submit */}
        <button type="submit">Sign Up</button>
        {/* Already have account */}
        <p className="already-account">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios, { Axios } from "axios";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import { ToastContainer, toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "./signup.css";

// // ✅ Validation Schema
// const validationSchema = Yup.object({
//   firstName: Yup.string()
//     .matches(
//       /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/,
//       "Invalid first name (no extra spaces, special characters)"
//     )
//     .required("First Name is required"),

//   lastName: Yup.string()
//     .matches(
//       /^[A-Za-z]{3,}( [A-Za-z]{3,})?$/,
//       "Invalid last name (no extra spaces, special characters)"
//     )
//     .required("Last Name is required"),

//   email: Yup.string()
//     .matches(
//       /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/,
//       "email should be valid"
//     )
//     .email("Invalid email format")
//     .required("Email is required"),

//   password: Yup.string()
//     .min(8, "Password must be at least 8 characters")
//     .matches(/[0-9]/, "Password must contain a number")
//     .matches(/[A-Z]/, "Password must contain an uppercase letter")
//     .matches(/[!@#$%^&*]/, "Password must contain a special character")
//     .required("Password is required"),

//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
// });
// export default function Signup() {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       if (editingUser) {
//         const updatedUsers = users.map((u) =>
//           u.id === editingUser.id ? { ...editingUser, ...values } : u
//         );
//         setUsers(updatedUsers);
//         setEditingUser(null);
//         toast.success("User updated successfully ✅");
//       } else {
//         // Duplicate email check
//         const emailExists = users.some((u) => u.email === values.email);
//         if (emailExists) {
//           toast.error("Email already exists ❌");
//           return;
//         }
//         const newUser = { id: Date.now(), ...values };
//         setUsers([...users, newUser]);
//         toast.success("User added successfully ✅");

//         //Send data to backend

//         try {
//           await axios.post("http://localhost:5000/api/auth/signup", {
//             firstName: values.firstName,
//             lastName: values.lastName,
//             email: values.email,
//             password: values.password,
//           });
//         } catch (error) {
//           toast.error(error.response.data.message || "backend error");
//         }
//       }
//       resetForm();
//     },
//   });

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     formik.setValues(user);
//   };

//   const handleDelete = (id) => {
//     setUsers(users.filter((u) => u.id !== id));
//     toast.success("User deleted successfully 🗑️");
//   };

//   return (
//     <div className="form-container">
//       {/* Form Card */}
//       <div className="form-card">
//         <h2>{editingUser ? "Edit User" : "Signup"}</h2>

//         <form onSubmit={formik.handleSubmit}>
//           {/* First Name */}
//           <div className="form-group">
//             <label>First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formik.values.firstName}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.firstName && formik.errors.firstName && (
//               <div className="error">{formik.errors.firstName}</div>
//             )}
//           </div>

//           {/* Last Name */}
//           <div className="form-group">
//             <label>Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formik.values.lastName}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.lastName && formik.errors.lastName && (
//               <div className="error">{formik.errors.lastName}</div>
//             )}
//           </div>

//           {/* Email */}
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               disabled={!!editingUser}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <div className="error">{formik.errors.email}</div>
//             )}
//           </div>

//           {/* Password */}
//           <div className="form-group password-input-wrapper">
//             <label>Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             <span
//               className="password-toggle"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </span>
//             {formik.touched.password && formik.errors.password && (
//               <div className="error">{formik.errors.password}</div>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group password-input-wrapper">
//             <label>Confirm Password</label>
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formik.values.confirmPassword}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             <span
//               className="password-toggle"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </span>
//             {formik.touched.confirmPassword &&
//               formik.errors.confirmPassword && (
//                 <div className="error">{formik.errors.confirmPassword}</div>
//               )}
//           </div>

//           <button type="submit">{editingUser ? "Update" : "Signup"}</button>
//           {!editingUser && (
//             <p className="already-account">
//               Already have an account? <Link to="/login">Login</Link>
//             </p>
//           )}
//         </form>
//       </div>

//       {/* Users Table (moved outside the form card) */}
//       <div className="users-table-wrap">
//         <h3>Users</h3>
//         <table className="users-table">
//           <thead>
//             <tr>
//               <th>First</th>
//               <th>Last</th>
//               <th>Email</th>
//               <th>Password</th>
//               <th>Confirm</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan="6" style={{ textAlign: "center" }}>
//                   No users yet
//                 </td>
//               </tr>
//             ) : (
//               users.map((u) => (
//                 <tr key={u.id}>
//                   <td>{u.firstName}</td>
//                   <td>{u.lastName}</td>
//                   <td>{u.email}</td>
//                   <td>{u.password}</td>
//                   <td>{u.confirmPassword}</td>
//                   <td>
//                     <button
//                       type="button"
//                       className="action-btn edit-btn"
//                       onClick={() => handleEdit(u)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       type="button"
//                       className="action-btn delete-btn"
//                       onClick={() => handleDelete(u.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// }

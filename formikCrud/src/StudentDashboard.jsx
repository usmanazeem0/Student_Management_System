import React, { useState } from "react";
import { FaSignOutAlt, FaUser, FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./studentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const formik = useFormik({
    initialValues: { courseName: "", courseCode: "", creditHour: "" },
    validationSchema: Yup.object({
      courseName: Yup.string().required("Course name is required"),
      courseCode: Yup.number()
        .required("Course code is required")
        .positive("Must be positive"),
      creditHour: Yup.number()
        .required("Credit hours are required")
        .min(1, "Min 1")
        .max(6, "Max 6"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (editingCourseId) {
        setCourses(
          courses.map((c) =>
            c.id === editingCourseId ? { ...values, id: editingCourseId } : c
          )
        );
        setEditingCourseId(null);
      } else {
        setCourses([...courses, { ...values, id: Date.now() }]);
      }
      resetForm();
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
    if (editingCourseId === id) {
      setEditingCourseId(null);
      formik.resetForm();
    }
  };

  const handleEdit = (id) => {
    const courseToEdit = courses.find((c) => c.id === id);
    if (courseToEdit) {
      formik.setValues({
        courseName: courseToEdit.courseName,
        courseCode: courseToEdit.courseCode,
        creditHour: courseToEdit.creditHour,
      });
      setEditingCourseId(id);
      setActiveTab("profile");
    }
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo">MySchool</div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "✖" : "☰"}
          </button>

          <button
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser />
            <span>Profile</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <FaBook />
            <span>Courses</span>
          </button>
        </aside>

        {/* Content */}
        <section className="content">
          {activeTab === "profile" && (
            <div className="profile-section">
              <h2>Manage Your Courses</h2>
              <form className="course-form" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="courseName">Course Name</label>
                  <input
                    id="courseName"
                    name="courseName"
                    type="text"
                    {...formik.getFieldProps("courseName")}
                  />
                  {formik.touched.courseName && formik.errors.courseName && (
                    <div className="error-message">
                      {formik.errors.courseName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="courseCode">Course Code</label>
                  <input
                    id="courseCode"
                    name="courseCode"
                    type="number"
                    {...formik.getFieldProps("courseCode")}
                  />
                  {formik.touched.courseCode && formik.errors.courseCode && (
                    <div className="error-message">
                      {formik.errors.courseCode}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="creditHour">Credit Hours</label>
                  <input
                    id="creditHour"
                    name="creditHour"
                    type="number"
                    {...formik.getFieldProps("creditHour")}
                  />
                  {formik.touched.creditHour && formik.errors.creditHour && (
                    <div className="error-message">
                      {formik.errors.creditHour}
                    </div>
                  )}
                </div>

                <button type="submit" className="add-course-btn">
                  {editingCourseId ? "Update Course" : "Add Course"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="courses-section">
              <h2>All Courses</h2>
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Credit Hours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.courseName}</td>
                        <td>{course.courseCode}</td>
                        <td>{course.creditHour}</td>
                        <td>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(course.id)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(course.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No courses added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { FaSignOutAlt, FaUser, FaBook, FaEdit, FaTrash } from "react-icons/fa";
// import { FaBars } from "react-icons/fa";

// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import "./studentDashboard.css";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [courses, setCourses] = useState([]);
//   const [editingCourseId, setEditingCourseId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const formik = useFormik({
//     initialValues: {
//       courseName: "",
//       courseCode: "",
//       creditHour: "",
//     },
//     validationSchema: Yup.object({
//       courseName: Yup.string().required("Course name is required"),
//       courseCode: Yup.number()
//         .required("Course code is required")
//         .positive("Must be positive"),
//       creditHour: Yup.number()
//         .required("Credit hours are required")
//         .min(1, "Min 1")
//         .max(6, "Max 6"),
//     }),
//     onSubmit: (values, { resetForm }) => {
//       if (editingCourseId) {
//         setCourses(
//           courses.map((c) =>
//             c.id === editingCourseId ? { ...values, id: editingCourseId } : c
//           )
//         );
//         setEditingCourseId(null);
//       } else {
//         setCourses([...courses, { ...values, id: Date.now() }]);
//       }
//       resetForm();
//     },
//   });

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   const handleDelete = (id) => {
//     setCourses(courses.filter((course) => course.id !== id));
//     if (editingCourseId === id) {
//       setEditingCourseId(null);
//       formik.resetForm();
//     }
//   };

//   const handleEdit = (id) => {
//     const courseToEdit = courses.find((c) => c.id === id);
//     if (courseToEdit) {
//       formik.setValues({
//         courseName: courseToEdit.courseName,
//         courseCode: courseToEdit.courseCode,
//         creditHour: courseToEdit.creditHour,
//       });
//       setEditingCourseId(id);
//       setActiveTab("profile"); // Switch to profile form for editing
//     }
//   };

//   return (
//     <div className="student-dashboard">
//       {/* Header */}
//       <header className="header">
//         <div className="logo">MySchool</div>

//         <button className="logout-btn" onClick={handleLogout}>
//           <FaSignOutAlt /> Logout
//         </button>
//       </header>

//       <div className="main-content">
//         {/* Sidebar */}
//         <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//           {/* Sidebar toggle button */}
//           <button
//             className="sidebar-toggle-btn"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             {sidebarOpen ? "✖" : "☰"}
//           </button>

//           <div className="sidebar-buttons">
//             <button
//               className={`sidebar-btn ${
//                 activeTab === "profile" ? "active" : ""
//               }`}
//               onClick={() => setActiveTab("profile")}
//             >
//               <FaUser />
//               <span>Profile</span>
//             </button>
//             <button
//               className={`sidebar-btn ${
//                 activeTab === "courses" ? "active" : ""
//               }`}
//               onClick={() => setActiveTab("courses")}
//             >
//               <FaBook />
//               <span>Courses</span>
//             </button>
//           </div>
//         </aside>

//         {/* Content */}
//         <section className="content">
//           {activeTab === "profile" && (
//             <div className="profile-section">
//               <h2>Manage Your Courses</h2>
//               <form className="course-form" onSubmit={formik.handleSubmit}>
//                 <div className="form-group">
//                   <label htmlFor="courseName">Course Name</label>
//                   <input
//                     id="courseName"
//                     name="courseName"
//                     type="text"
//                     {...formik.getFieldProps("courseName")}
//                   />
//                   {formik.touched.courseName && formik.errors.courseName && (
//                     <div className="error-message">
//                       {formik.errors.courseName}
//                     </div>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="courseCode">Course Code</label>
//                   <input
//                     id="courseCode"
//                     name="courseCode"
//                     type="number"
//                     {...formik.getFieldProps("courseCode")}
//                   />
//                   {formik.touched.courseCode && formik.errors.courseCode && (
//                     <div className="error-message">
//                       {formik.errors.courseCode}
//                     </div>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="creditHour">Credit Hours</label>
//                   <input
//                     id="creditHour"
//                     name="creditHour"
//                     type="number"
//                     {...formik.getFieldProps("creditHour")}
//                   />
//                   {formik.touched.creditHour && formik.errors.creditHour && (
//                     <div className="error-message">
//                       {formik.errors.creditHour}
//                     </div>
//                   )}
//                 </div>

//                 <button type="submit" className="add-course-btn">
//                   {editingCourseId ? "Update Course" : "Add Course"}
//                 </button>
//               </form>
//             </div>
//           )}

//           {activeTab === "courses" && (
//             <div className="courses-section">
//               <h2>All Courses</h2>
//               <table className="courses-table">
//                 <thead>
//                   <tr>
//                     <th>Course Name</th>
//                     <th>Course Code</th>
//                     <th>Credit Hours</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {courses.length > 0 ? (
//                     courses.map((course) => (
//                       <tr key={course.id}>
//                         <td>{course.courseName}</td>
//                         <td>{course.courseCode}</td>
//                         <td>{course.creditHour}</td>
//                         <td>
//                           <button
//                             className="action-btn edit"
//                             onClick={() => handleEdit(course.id)}
//                           >
//                             <FaEdit /> Edit
//                           </button>
//                           <button
//                             className="action-btn delete"
//                             onClick={() => handleDelete(course.id)}
//                           >
//                             <FaTrash /> Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="no-data">
//                         No courses added yet.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

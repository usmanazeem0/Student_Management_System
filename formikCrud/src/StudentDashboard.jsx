import React, { useEffect, useState } from "react";
import { FaSignOutAlt, FaUser, FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Yup from "yup";
import "./studentDashboard.css";
import axios from "axios";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchCreditHour, setSearchCreditHour] = useState("");

  const token = localStorage.getItem("token");

  //useEffect to fetch courses from the backend
  useEffect(() => {
    fetchCourses();
  }, []);

  // filter the students for search filters

  const filterCourses = courses.filter((course) => {
    const matchName =
      searchName !== "" &&
      course.courseName.toLowerCase().includes(searchName.toLowerCase());

    const matchCode =
      searchCode !== "" && String(course.courseCode) === searchCode;

    const matchCreditHour =
      searchCreditHour !== "" && String(course.creditHour) === searchCreditHour;

    // if no filters apply show all the added courses

    if (searchName === "" && searchCode === "" && searchCreditHour === "") {
      return true;
    }
    return matchName || matchCode || matchCreditHour;
    // return (
    //   (searchName === "" ||
    //     course.courseName
    //       .toLowerCase()
    //       .includes(searchName.toLocaleLowerCase())) &&
    //   (searchCode === "" || String(course.courseCode) === searchCode) &&
    //   (searchCreditHour === "" ||
    //     String(course.creditHour) === searchCreditHour)
    // );
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

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
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingCourseId) {
          await axios.put(
            `http://localhost:5000/courses/${editingCourseId}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Course updated successfully!");
          setEditingCourseId(null);
        } else {
          await axios.post("http://localhost:5000/courses/addCourse", values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Course added successfully!");
        }

        fetchCourses();
        resetForm();

        // Switch to Courses tab after add/update
        setActiveTab("courses");
      } catch (error) {
        console.error("Error submitting course:", error);
      }
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!");

      fetchCourses();
      if (editingCourseId === id) {
        setEditingCourseId(null);
        formik.resetForm();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEdit = async (id) => {
    const courseToEdit = courses.find((c) => c._id === id);
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
              <div className="search-filters">
                <input
                  type="text"
                  placeholder="Search by Course Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Search by Course Code"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Search by Credit Hour"
                  value={searchCreditHour}
                  onChange={(e) => setSearchCreditHour(e.target.value)}
                />
              </div>
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
                  {filterCourses.length > 0 ? (
                    filterCourses.map((course) => (
                      <tr key={course._id}>
                        <td>{course.courseName}</td>
                        <td>{course.courseCode}</td>
                        <td>{course.creditHour}</td>
                        <td>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(course._id)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(course._id)}
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

      <ToastContainer />
    </div>
  );
}

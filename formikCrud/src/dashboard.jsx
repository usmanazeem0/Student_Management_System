import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaSignOutAlt } from "react-icons/fa";
import "./dashboard.css";

export default function DashBoard() {
  const navigate = useNavigate();

  // add the teacher email into local Storage
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);

  // fetch students for specific teacher

  useEffect(() => {
    const fetchedStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/students/my-students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(res.data); // only for sepcific teacher
      } catch (error) {
        console.log("error while fetchcing students", error);
      }
    };
    fetchedStudents();
  }, []);
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      course: "",
      dob: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .matches(
          /^[A-Za-z]{3,}( [A-Za-z]{3,}){0,3}$/,
          "Name should not contain number special character and spaces"
        )
        .required("Name is required"),
      email: Yup.string()
        .matches(
          /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/,
          "email should be valid"
        )
        .email("Invalid email format")
        .required("Email is required"),
      course: Yup.string()
        .matches(
          /^(?:[A-Za-z]{3,}-\d{2,3}|[A-Za-z]{3,}(?: [A-Za-z]{3,})*-\d{2,3})$/i,
          "Course must be like ENG-101 or Web Development"
        )
        .required("Course is required"),
      dob: Yup.date()
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future")
        .test(
          "min-age",
          "Student must be at least 5 years old",
          function (value) {
            if (!value) return false;
            const today = new Date();
            let age = today.getFullYear() - value.getFullYear();
            const m = today.getMonth() - value.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
              age--;
            }
            return age >= 5;
          }
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingStudentId) {
          const response = await axios.put(
            `http://localhost:5000/students/${editingStudentId}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setStudents((prev) =>
            prev.map((stu) =>
              stu._id === editingStudentId ? response.data : stu
            )
          );

          toast.success("Student updated successfully");
          setEditingStudentId(null);
        } else {
          const response = await axios.post(
            "http://localhost:5000/students/add",
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Add new student to state
          setStudents((prev) => [...prev, response.data.student]);

          toast.success(response.data.message || "student saved successfully", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        // Send to backend with teacher’s email as foreign key
        resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save student", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Logout handler
  const handleLogout = () => {
    // remove token/localStorage laer
    localStorage.removeItem("token");
    navigate("/login");
  };

  // handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents((prev) => prev.filter((student) => student._id !== id));
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error("failed to delete student");
    }
  };

  //handle edit

  const handleEdit = (student) => {
    formik.setValues({
      name: student.name,
      email: student.email, // email is non-editable
      course: student.course,
      dob: student.dob.split("T")[0], // format date for input
    });

    setEditingStudentId(student._id); // track which student is being edited
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-header">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Dashboard Heading */}
      <h2 className="dashboard-title">Teacher Dashboard</h2>

      {/* Student Form */}
      <form onSubmit={formik.handleSubmit} className="student-form">
        {/* Student Name */}
        <label>
          Student Name:
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error-text">{formik.errors.name}</div>
          )}
        </label>

        {/* Student Email */}
        <label>
          Student Email:
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!!editingStudentId} // disabled when editing
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-text">{formik.errors.email}</div>
          )}
        </label>

        {/* Course */}
        <label>
          Course:
          <input
            type="text"
            name="course"
            value={formik.values.course}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.course && formik.errors.course && (
            <div className="error-text">{formik.errors.course}</div>
          )}
        </label>

        {/* DOB */}
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dob && formik.errors.dob && (
            <div className="error-text">{formik.errors.dob}</div>
          )}
        </label>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Save Student
        </button>
      </form>

      {/* Submit Button */}

      <h3>My Students</h3>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>DOB</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="no-students">
                no student is added yet
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{new Date(student.dob).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(student)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import "./paginatePractice.css";

const PaginatePractice = () => {
  const students = [
    { name: "Ali", rollNo: 1, className: "10th" },
    { name: "Sara", rollNo: 2, className: "9th" },
    { name: "Usman", rollNo: 3, className: "8th" },
    { name: "Ayesha", rollNo: 4, className: "10th" },
    { name: "Bilal", rollNo: 5, className: "7th" },
    { name: "Hina", rollNo: 6, className: "6th" },
    { name: "Zara", rollNo: 7, className: "10th" },
    { name: "Omar", rollNo: 8, className: "9th" },
    { name: "Hamza", rollNo: 9, className: "8th" },
    { name: "Kiran", rollNo: 10, className: "7th" },
    { name: "Fahad", rollNo: 11, className: "6th" },
    { name: "Sadia", rollNo: 12, className: "9th" },
    { name: "Imran", rollNo: 13, className: "10th" },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const studentsPerPage = 5;

  const offSet = currentPage * studentsPerPage;
  const currentStudents = students.slice(offSet, offSet + studentsPerPage);
  const pageCount = Math.ceil(students.length / studentsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="practice-container">
      <h2>Pagination Practice</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{student.className}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default PaginationPractice;

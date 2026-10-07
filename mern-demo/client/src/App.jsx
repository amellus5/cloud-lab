import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // THÊM SINH VIÊN - POST
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      });

      const newStudent = await response.json();

      setStudents((prevStudents) => [
        ...prevStudents,
        newStudent,
      ]);

      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi thêm sinh viên:", error);
    }
  };

  // =========================
  // CẬP NHẬT SINH VIÊN - PUT
  // =========================
  const handleUpdate = async (id) => {
    const newName = prompt("Nhập họ tên mới:");
    const newEmail = prompt("Nhập email mới:");

    if (!newName || !newEmail) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
        }),
      });

      const updatedStudent = await response.json();

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? updatedStudent : student
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật sinh viên:", error);
    }
  };

  // =========================
  // XÓA SINH VIÊN - DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xóa sinh viên thất bại");
      }

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );
    } catch (error) {
      console.error("Lỗi xóa sinh viên:", error);
    }
  };

  // =========================
  // LẤY DANH SÁCH - GET
  // =========================
  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách:", error);
      });
  }, []);

  // =========================
  // GIAO DIỆN
  // =========================
  return (
    <div>
      <h1>Danh sách sinh viên</h1>

      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      <h2>Danh sách</h2>

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.studentId} - {student.name} - {student.email}

            {" "}

            <button
              type="button"
              onClick={() => handleUpdate(student._id)}
            >
              Sửa
            </button>

            {" "}

            <button
              type="button"
              onClick={() => handleDelete(student._id)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
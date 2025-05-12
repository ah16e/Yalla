import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export default function FindTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/courses`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then((res) => {
      setTeachers(res.data.data || res.data || []);
      setFiltered(res.data.data || res.data || []);
    });
  }, [user]);

  useEffect(() => {
    if (!search) {
      setFiltered(teachers);
    } else {
      setFiltered(
        teachers.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, teachers]);

  if (!user?.token) {
    return <div className="max-w-6xl mx-auto p-8 text-center text-gray-400">You must be logged in to view teachers.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Find a Teacher</h1>
      <input
        type="text"
        placeholder="Search by teacher name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mx-auto block px-4 py-2 mb-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No teachers found.</div>
        ) : (
          filtered.map((teacher) => (
            <div key={teacher._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full max-w-xs mx-auto">
              <img
                src={teacher.image ? teacher.image : "https://via.placeholder.com/120x120"}
                alt={teacher.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-3 border-2 border-blue-200"
              />
              <h2 className="font-bold text-base sm:text-lg mb-1 text-center break-words">{teacher.name}</h2>
              <p className="text-xs text-gray-500 mb-2 text-center break-words">{teacher.email}</p>
              <span className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5 mb-2">PROFESSIONAL TEACHER</span>
              <a href={`/teacher/${teacher._id}`} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm">View Profile</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
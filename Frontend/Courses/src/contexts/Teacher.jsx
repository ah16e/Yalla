import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";


export const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
    const [teachers, setTeacher] = useState([]);
    const [loading , setLoading] = useState(true);

    const getTeacher = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/courses");
            console.log("API response:", res.data); // مفيد للتأكد
            setTeacher(res.data); // ✅ هنا التعديل
            setLoading(false);
          } catch (error) {
            console.log("Error fetching teacher data:", error);
            setLoading(false);
          }
        
    }
    useEffect(() => {
        getTeacher();
    }, []);



    return (
        <TeacherContext.Provider value={{ teachers, loading }}>
            {children}
        </TeacherContext.Provider>
    );

};

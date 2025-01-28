import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import { getUserinfo } from "../services/get";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUserinfo = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (token) {
        try {
          const decodedInfo = jwtDecode(token);
          const userData = await getUserinfo(decodedInfo.id); 
          setUser(userData);
        } catch (error) {
          console.error("Error al recuperar la información del usuario", error);
          setError(error); 
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };

    fetchUserinfo();
  }, []);

  return { user, loading, error };
};

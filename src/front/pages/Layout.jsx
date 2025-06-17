import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer'; // <-- ¡Importa tu hook global!


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { store, dispatch } = useGlobalReducer();
    //Esta es una forma de aplicar la expulcion por expiracion de token , tambien podria hacerce donde de encuentran los fetch privados
    useEffect(() => {
        const token = localStorage.getItem("token");
        const currentPage = location.pathname;

        if (!token) {

            if (store.token || Object.keys(store.userInfo).length > 0) {
                dispatch({ type: "LOGOUT_USER" });
            }
            navigate("/login");
            return;
        }

        try {
            const { exp } = jwtDecode(token);
            if (Date.now() >= exp * 1000) {
                console.log("Token expirado detectado en Layout. Redirigiendo y limpiando.");
                localStorage.removeItem("token"); // Borra del localStorage
                dispatch({ type: "LOGOUT_USER" }); // <-- ¡Llama a la acción LOGOUT_USER para limpiar el estado global!
                navigate("/login"); // Redirige al login o home
            }
        } catch (error) {
            // Esto se ejecuta si el token no es un JWT válido o está corrupto
            console.error("Error al decodificar o validar el token en Layout:", error);
            localStorage.removeItem("token"); // Borra del localStorage
            dispatch({ type: "LOGOUT_USER" }); // <-- ¡Llama a la acción LOGOUT_USER para limpiar el estado global!
            navigate("/login"); // Redirige al login o home
        }
    }, [navigate, location.pathname, dispatch, store.token, store.userInfo]);
    return (
        <ScrollToTop>
            <Navbar />
            <Outlet />
            <Footer />
        </ScrollToTop>
    )

}








// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.

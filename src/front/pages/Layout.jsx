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

    const publicPaths = ["/", "/login", "/register"];
    //Esta es una forma de aplicar la expulcion por expiracion de token , tambien podria hacerce donde de encuentran los fetch privados
    useEffect(() => {
        const token = localStorage.getItem("token");
        const currentPage = location.pathname;

        // 1. Si la página actual es una ruta pública, no hacemos ninguna verificación de token aquí.
        if (publicPaths.includes(currentPage)) {
            // Opcional: Si estás en una ruta pública pero tienes un token expirado en localStorage,
            // podrías limpiarlo aquí sin forzar una redirección.
            if (token) {
                try {
                    const { exp } = jwtDecode(token);
                    const currentTime = Date.now();
                    if (currentTime >= exp * 1000) {
                        console.log("Token expirado en ruta pública. Limpiando localStorage.");
                        localStorage.removeItem("token");
                        dispatch({ type: "LOGOUT_USER" }); // Limpia el estado global (userInfo, etc.)
                    }
                } catch (error) {
                    console.error("Token inválido en ruta pública. Limpiando localStorage.", error);
                    localStorage.removeItem("token");
                    dispatch({ type: "LOGOUT_USER" }); // Limpia el estado global
                }
            }
            return; // Salimos del efecto, no se necesita redirección
        }

        // 2. Si la página actual NO es una ruta pública (es decir, es una RUTA PROTEGIDA)
        // y no hay token o el token es inválido/expirado, entonces redirigimos.

        // Si NO hay token
        if (!token) {
            console.log("No hay token para ruta protegida. Redirigiendo a /login.");
            // Aseguramos que el estado global esté limpio si no hay token
            if (store.token || Object.keys(store.userInfo).length > 0) {
                dispatch({ type: "LOGOUT_USER" });
            }
            navigate("/login");
            return;
        }

        // Si hay token, pero podría estar expirado o ser inválido
        try {
            const { exp } = jwtDecode(token);
            const currentTime = Date.now();

            if (currentTime >= exp * 1000) {
                console.log("Token expirado para ruta protegida. Limpiando y redirigiendo a /login.");
                localStorage.removeItem("token");
                dispatch({ type: "LOGOUT_USER" });
                navigate("/login");
            }
        } catch (error) {
            // El token existe pero no es un JWT válido (corrupto, etc.)
            console.error("Token inválido para ruta protegida. Limpiando y redirigiendo a /login:", error);
            localStorage.removeItem("token");
            dispatch({ type: "LOGOUT_USER" });
            navigate("/login");
        }

    }, [navigate, location.pathname, dispatch, store.token, store.userInfo]); // Dependencias del useEffect

    return (
        <ScrollToTop>
            <Navbar />
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};








// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.

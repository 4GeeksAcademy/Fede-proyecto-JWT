import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer'; // Asegúrate de que la ruta sea correcta

export const LogoutButton = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer(); // Necesitas el dispatch para limpiar el estado del usuario

    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        console.log("Token eliminado de localStorage.");

        // Limpiar el estado global del usuario (si lo tienes)
        dispatch({ type: "LOGOUT_USER" });

        navigate('/login');
        console.log("Usuario redirigido a la página de login.");
    };

    return (
        <button
            className="btn btn-danger"
            onClick={handleLogout}
        >
            Cerrar Sesión
        </button>
    );
};
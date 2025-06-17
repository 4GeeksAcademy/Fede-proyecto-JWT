import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoutButton } from './LogoutButton'; // Asegúrate de que la ruta sea correcta a tu componente LogoutButton
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Navbar = () => {
	// Obtener el token del localStorage
	const { store } = useGlobalReducer();
	const token = store.token;

	const location = useLocation(); // esto es para saber en que ruta se encuentra el usuario
	const isLoginPage = location.pathname === '/login';

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{/* Renderizado condicional basado en la existencia del token */}
					{token ? (
						// Si SÍ hay token (usuario logueado), muestra el botón de Logout
						<LogoutButton />
					) : (
						// Si NO hay token (usuario no logueado), muestra el botón de Login o el de "Check the Context"
						!isLoginPage &&
						<Link to="/login"> {/* Asumiendo que tu ruta de login es '/login' */}
							<button className="btn btn-primary">Iniciar Sesión</button>
						</Link>

					)}
				</div>
			</div>
		</nav>
	);
};

/* import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
}; */


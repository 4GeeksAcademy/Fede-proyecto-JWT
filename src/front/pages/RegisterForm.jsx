import React, { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from 'react-router-dom';
import { register } from "../fetch/user.js";

export const RegisterForm = () => {

    const { store, dispatch } = useGlobalReducer()
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()



    async function formSubmit(e) {
        e.preventDefault()
        if (!password || !email || !fullname) {
            alert("debe espicificar todos los campos")
            return
        }
        try {
            // 2. Llamada a la función de registro
            let response = await register(fullname, email, password);

            // 3. Manejo de la respuesta del backend
            // Asumimos que tu función `register` devuelve un objeto con { success: true/false, msg: "Mensaje" }
            if (response.ok) {
                alert(response.msg || "Registro exitoso. Por favor, inicia sesión.");
                navigate("/login"); // Navega a /login SOLAMENTE después de un registro exitoso
            } else {
                // Si el registro no fue exitoso (ej. email ya existe), muestra el mensaje de error del backend
                alert(response.msg || "Error en el registro. Inténtalo de nuevo.");
            }
        } catch (error) {
            // 4. Captura de errores de red o del fetch
            console.error("Ocurrió un error al intentar registrar:", error);
            alert("Ocurrió un error de conexión. Por favor, inténtalo más tarde.");
        }


    }

    return <div className="m-5">
        <h1>Register</h1>
        <form onSubmit={formSubmit}>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                <input value={fullname} onChange={(e) => setFullname(e.target.value)} type="fullname" className="form-control" id="exampleInputFullname1" aria-describedby="fullnameHelp" />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>

}
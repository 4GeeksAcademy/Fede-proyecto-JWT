import React, { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from 'react-router-dom';


export const RegisterForm = () => {

    const { store, dispatch } = useGlobalReducer()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    //Aqui aplcamos este usEffect para que si hay token no me deje ir al login y me redirija al home
    useEffect(() => {
        if (store.token) {
            navigate("/")
        }

    }, [store.token])

    async function formSubmit(e) {
        e.preventDefault()
        if (!password || !email) {
            alert("debe espicificar todos los campos")
            return
        }
        let response = await login(dispatch, email, password)
        if (!response.token) {
            alert(response.msg)
            return
        }
        console.log("sesion iniciada")
        navigate("/private")



    }

    return <div className="m-5">
        <h1>Register</h1>
        <form onSubmit={formSubmit}>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>

}
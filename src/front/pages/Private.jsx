import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { publicFetch } from "../fetch/apiFetch.js";
import { getInfo } from "../fetch/user.js";


export const Private = () => {

    const { store, dispatch } = useGlobalReducer()


    useEffect(() => {
        if (store.token) {
            getInfo(dispatch)
        }
    }, [store.token])

    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Esta es tu zona privada</h1>
            <div className="alert alert-info">
                {store.userInfo ? (
                    <span>{JSON.stringify(store.userInfo.user)}</span>
                ) : (
                    <span className="text-danger">
                        No puedes ver esta informacion sin loguearte
                    </span>
                )}
            </div>
        </div>
    );
}; 
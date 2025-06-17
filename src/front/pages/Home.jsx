import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { publicFetch } from "../fetch/apiFetch.js";
import { getInfo } from "../fetch/user.js";


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()


	useEffect(() => {
		if (store.token) {
			getInfo(dispatch)
		}
	}, [store.token])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">

			</div>
		</div>
	);
}; 
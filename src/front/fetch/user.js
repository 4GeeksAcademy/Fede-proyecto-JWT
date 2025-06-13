import { publicFetch, privateFetch } from "./apifetch";

export const login = async (dispatch, email, password) => {
  let response = await publicFetch("/login", "POST", { email, password });
  if (!response.token) {
    return response;
  }
  localStorage.setItem("token", response.token); // esto es para que el token se guarde en el localStore (esto se ve desde el apartado aplications en el inspector)
  dispatch({ type: "SET_TOKEN", payload: response.token });
  return response;
};

export const logout = async () => {};

export const register = async () => {};

export const getInfo = async () => {
  let response = await privateFetch("/userinfo");
  if (response.msg) {
    console.error(response.msg);
    return null;
  }
  dispatch({ type: "SET_USER_INFO", payload: response });
  return response;
};

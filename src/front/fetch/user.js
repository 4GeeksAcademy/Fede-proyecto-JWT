import { publicFetch, privateFetch } from "./apiFetch";

export const login = async (dispatch, email, password) => {
  let response = await publicFetch("/login", "POST", { email, password });
  if (!response.token) {
    return response;
  }
  localStorage.setItem("token", response.token); // esto es para que el token se guarde en el localStore (esto se ve desde el apartado aplications en el inspector)
  dispatch({ type: "SET_TOKEN", payload: response.token });
  return response;
};

export const register = async (fullname, email, password) => {
  try {
    const responseData = await publicFetch("/register", "POST", {
      fullname,
      email,
      password,
    });

    // Si publicFetch retornó un objeto con `error: true`, significa que hubo un problema.
    if (responseData && responseData.error) {
      console.error("Registro Error:", responseData.msg);
      return { ok: false, msg: responseData.msg };
    }

    console.log("Usuario registrado con éxito:", responseData);
    return { ok: true, msg: "Registro completado exitosamente." };
  } catch (error) {
    console.error("Error inesperado en registro:", error);
    return {
      ok: false,
      msg: "Ocurrió un error inesperado durante el registro.",
    };
  }
};

export const getInfo = async (dispatch) => {
  let response = await privateFetch("/private");
  if (response.msg) {
    console.error(response.msg);
    return null;
  }
  dispatch({ type: "SET_USER_INFO", payload: response });
  console.log(response);
  return response;
};

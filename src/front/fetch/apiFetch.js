const apiUrl = import.meta.env.VITE_BACKEND_URL;

//CODIGO ORIGINAL ARNALDO
/* export const publicFetch = async (endpoint, method = "GET", body = null) => {
  let params = {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(apiUrl + endpoint, params);
    
    if (response.status >= 500) {
      console.error(response.status, response.statusText);
      return null;
    }
    if (response.status >= 400) {
      console.error(response.status, response.statusText);

      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }

  export const privateFetch = async (endpoint, method = "GET", body = null) => {
  let params = {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("token"), // aqui hay que recordar de poner un espacio despues de Bearer sino da error
    },
  };

  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }
  try {
    let response = await fetch(apiUrl + endpoint, params);
    if (response.status >= 500) {
      console.error(response.status, response.statusText);
      return null;
    }
    if (response.status >= 400) {
      console.error(response.status, response.statusText);

      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

}; */

export const publicFetch = async (endpoint, method = "GET", body = null) => {
  let params = {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(apiUrl + endpoint, params);

    if (!response.ok) {
      // Intentamos leer el JSON del error para obtener el mensaje del backend.
      const errorData = await response
        .json()
        .catch(() => ({ msg: "Error desconocido del servidor." }));
      throw new Error(
        JSON.stringify({
          status: response.status,
          data: errorData,
        })
      );
    }

    return await response.json();
  } catch (error) {
    // Este `catch` ahora maneja TRES tipos de errores:
    // 1. Errores de red (si `fetch` no puede conectar).
    // 2. Errores al parsear el JSON (si `response.json()` falla).
    // 3. ¡Los errores HTTP (4xx, 5xx) que lanzamos nosotros arriba!

    let parsedError = {
      status: 0,
      msg: "Error de conexión o respuesta inválida.",
    };

    try {
      const errorInfo = JSON.parse(error.message);
      if (errorInfo.status && errorInfo.data) {
        parsedError = {
          status: errorInfo.status,
          msg: errorInfo.data.msg || `Error HTTP ${errorInfo.status}`,
        };
      }
    } catch (error) {
      // Si no se puede parsear (es un error de red o de otro tipo), usamos el mensaje original del error.
      parsedError.msg = error.message;
    }

    return { error: true, ...parsedError };
  }
};

export const privateFetch = async (endpoint, method = "GET", body = null) => {
  let params = {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(apiUrl + endpoint, params);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ msg: "Error desconocido del servidor." }));
      throw new Error(
        JSON.stringify({
          status: response.status,
          data: errorData,
        })
      );
    }

    return await response.json();
  } catch (error) {
    let parsedError = {
      status: 0,
      msg: "Error de conexión o respuesta inválida.",
    };

    try {
      const errorInfo = JSON.parse(error.message);
      if (errorInfo.status && errorInfo.data) {
        parsedError = {
          status: errorInfo.status,
          msg: errorInfo.data.msg || `Error HTTP ${errorInfo.status}`,
        };
      }
    } catch (error) {
      parsedError.msg = error.message;
    }

    return { error: true, ...parsedError };
  }
};

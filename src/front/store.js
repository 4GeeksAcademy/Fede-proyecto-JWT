export const initialStore = () => {
  return {
    message: null,
    token: null,
    userInfo: {},
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    redirectPath: null,
  };
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodifica la parte del payload del JWT
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    // Si el tiempo de expiración (exp) es menor que el tiempo actual, el token ha caducado
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error al decodificar el token o token inválido:", error);
    return true; // Considera el token como caducado o inválido si no se puede decodificar
  }
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "SET_TOKEN":
      return {
        ...store,
        token: action.payload,
      };
    case "LOAD_TOKEN":
      return {
        ...store,
        token: localStorage.getItem("token") || null,
      };
    case "SET_USER_INFO":
      return {
        ...store,
        userInfo: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...store, // Mantén otras partes del estado si es necesario (como los todos)
        token: null, // Restablece el token a null
        userInfo: {}, // Restablece la información del usuario a un objeto vacío
      };

    default:
      throw Error("Unknown action.");
  }
}

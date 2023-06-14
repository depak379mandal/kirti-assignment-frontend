import Axios, { AxiosStatic } from "axios";

class Client {
  private axios: AxiosStatic = Axios;

  constructor() {
    this.axios.defaults.baseURL = "http://localhost:8000";
  }

  create = () => {
    return this.axios;
  };

  createWithAuth = () => {
    const auth_token = localStorage.getItem("auth_token");

    this.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${auth_token}`;
    return this.axios;
  };
}

export default new Client().create();
export const AuthClient = new Client().createWithAuth;

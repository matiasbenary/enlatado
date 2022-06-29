import { Token } from "@/models/token.model";
import axios, { Method, ResponseType } from "axios";
import moment from "moment";

export const BASE_URL = import.meta.env.VITE_APP_API_URL;

const returnObjectOrNull = <T>(obj: T) => {
  return Object.keys(obj).length !== 0 ? obj : null;
};

const getHeaderLocalStorage = (): Token =>
  returnObjectOrNull(JSON.parse(localStorage.getItem("token") || "{}"));

const getUserLocalStorage = (): string =>
  returnObjectOrNull(JSON.parse(localStorage.getItem("authUser") || "{}"))
    ?.state?.user?.id;

const setHeaderLocalStorage = (res: {
  token_type: string;
  access_token: string;
}) => {
  const header = {
    Authorization: `${res.token_type} ${res.access_token}`,
  };
  localStorage.setItem("token", JSON.stringify(header));
};

const getExpireTokenLocalStorage = () =>
  returnObjectOrNull(JSON.parse(localStorage.getItem("expire_token") || "{}"));

const setExpireTokenLocalStorage = (res: { expires_in: string }) =>
  localStorage.setItem(
    "expire_token",
    JSON.stringify(moment().add(res.expires_in, "s"))
  );

const hasExpireToken = (expireToken: string): boolean => expireToken !== null;

const isExpiredToken = (expireToken: string): boolean =>
  moment().diff(expireToken) <= 0;

const hasToken = (token: Token): boolean => token !== null;

export const getToken = async () => {
  let token = getHeaderLocalStorage();
  const expireToken = getExpireTokenLocalStorage();

  if (
    !(
      hasExpireToken(expireToken) &&
      isExpiredToken(expireToken) &&
      hasToken(token)
    )
  ) {
    const params = new FormData();
    params.set("grant_type", "client_credentials");
    params.set("scope", "*");
    params.set("client_id", import.meta.env.VITE_APP_API_CLIENT_ID);
    params.set("client_secret", import.meta.env.VITE_APP_API_CLIENT_SECRET);
    try {
      const res = await axios({
        method: "post",
        url: `${BASE_URL}oauth/token`,
        data: params,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      setHeaderLocalStorage(res.data);
      setExpireTokenLocalStorage(res.data);
      token = getHeaderLocalStorage();
    } catch (err) {
      console.log(err);
    }
  }

  return token;
};

export const apiCall = async (
  url: string,
  data: any,
  method: Method = "GET",
  responseType: ResponseType = "json"
) => {
  const token = await getToken();
  const user = getUserLocalStorage();
  const headers = {
    ...token,
    ...(user && { "User-Id": getUserLocalStorage() }),
    "Entity-Id": <string>import.meta.env.VITE_APP_ID_ENTITY,
  };

  return axios({
    url: `${BASE_URL}api/${url}`,
    method,
    data,
    headers,
    responseType,
  });
};

export const saveUser = (user: object) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearStorage = (exceptions: string[]) => {
  if (!exceptions || !exceptions.length) return localStorage.clear();

  const keys = Object.keys(localStorage);
  //loop through keys
  for (let i = 0; i < keys.length; i++) {
    let deleteItem = true;
    //check if key excluded
    for (let j = 0; j < exceptions.length; j++) {
      if (keys[i] === exceptions[j]) deleteItem = false;
    }
    //delete key
    if (deleteItem) {
      localStorage.removeItem(keys[i]);
    }
  }
};

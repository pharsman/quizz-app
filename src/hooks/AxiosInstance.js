import axios from "axios";
import brands from "@/hooks/Brands";
import { store } from "@/store/index.js";
import { createNotification } from "masterComponents/ToastNotification";

const isLocal = ~location.href.indexOf("localhost");

const commonConfig = {
  baseURL: isLocal ? "https://newadmin.upgaming.dev/api/" : "/api/",
};

const requestInterceptorCollback = (config) => {
  // const productConfig = JSON.parse(localStorage.getItem('gamesConfig'))
  const adminConfig = JSON.parse(localStorage.getItem("adminConfig"));

  const token = adminConfig.token;

  const tabSession = localStorage.getItem("tabSessionID");
  if (token) config.headers.Authorization = `bearer ${token}`;

  config.headers["ug-tabsession"] = tabSession;

  if (config.url.includes("Account/ResetPassword")) {
    config.headers.common["ug-proxy"] = "common";
  } else {
    config.headers.common["ug-proxy"] = "oneadmin";
  }

  config.headers.common["ug-brands"] = brands.value.join("|");

  return config;
};

const oneAdminAxios = axios.create({ ...commonConfig });

oneAdminAxios.interceptors.request.use(requestInterceptorCollback);

oneAdminAxios.interceptors.request.use(
  (config) => {
    // console.log('loading trueee');

    return config;
  },
  (err) => {
    // alert('something went wrong')
    // console.log('errorrr', err);
  }
);
oneAdminAxios.interceptors.response.use(
  (config) => {
    // console.log('loading falsee');

    if (config.data.Error) {
      createNotification(config.data.Error, "error", 3500, "bottom-center", 2);
    }

    return config;
  },
  (err) => {
    createNotification(
      "Something went wrong.",
      "error",
      3500,
      "bottom-center",
      2
    );
  }
);

// export default axiosInstanceOne
export default oneAdminAxios;

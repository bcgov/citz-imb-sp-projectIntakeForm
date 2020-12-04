import { GetFormDigestValue } from "citz-imb-sp-utilities";

const doFetch = (url, endPoint, options) => {
  return new Promise((resolve, reject) => {
    fetch(`${url}${endPoint}`, options).then((response) => {
      if (response.ok) {
        if (response.status === 204) {
          resolve();
        } else if (response.status === 304) {
          console.warning(`${response.status} ${response.statusText} ${endPoint}`);
          resolve(response.json());
        } else {
          resolve(response.json());
        }
      } else {
        reject(`${response.status} ${response.statusText}`);
      }
    });
  });
};

export const RestCall = ({ url = "", endPoint, method = "get", body = "", headers, cache }) => {
  if (url === "") {
    if (typeof _spPageContextInfo === "undefined") {
      return Promise.reject("RestCall:: _spPageContextInfo is not defined");
    } else {
      // eslint-disable-next-line
      url = _spPageContextInfo.webAbsoluteUrl;
    }
  }

  let options = { method: method };

  if (typeof body !== "string") {
    options.body = JSON.stringify(body);
  } else {
    if (body !== "") options.body = body;
  }

  if (headers) {
    options.headers = headers;
  } else {
    options.headers = {
      Accept: "application/json;odata=verbose",
      "content-type": "application/json;odata=verbose",
    };
  }
  if (cache) {
    options.cache = cache;
  } else {
    if (method === "get") {
      //options.cache = 'reload'
      //options.headers['If-Match'] = "*"
      options.headers["Cache-Control"] = "no-cache";
      options.headers["Pragma"] = "no-cache";
    }
  }

  return new Promise((resolve, reject) => {
    switch (options.method.toLowerCase()) {
      case "post":
        GetFormDigestValue(url).then((response) => {
          options.headers["X-RequestDigest"] = response;
          doFetch(url, endPoint, options)
            .then((response) => {
              resolve(response);
            })
            .catch((response) => {
              console.warn(`options`, options);
              reject(response);
            });
        });
        break;
      case "merge":
        GetFormDigestValue(url).then((response) => {
          options.headers["X-RequestDigest"] = response;
          options.headers["X-HTTP-Method"] = "MERGE";
          options.headers["If-Match"] = "*";
          options.method = "post";

          doFetch(url, endPoint, options)
            .then((response) => {
              resolve(response);
            })
            .catch((response) => {
              console.warn(`options`, options);
              reject(response);
            });
        });
        break;
      default:
        doFetch(url, endPoint, options)
          .then((response) => {
            resolve(response);
          })
          .catch((response) => {
            console.warn(`options`, options);
            reject(response);
          });
    }
  });
};

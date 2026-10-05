// jadec/src/lib/app-params.js

const getAppParams = () => {
  return {
    appBaseUrl: import.meta.env.VITE_API_URL || "",
    fromUrl:
      typeof window !== "undefined"
        ? window.location.href
        : ""
  };
};

export const appParams = getAppParams();
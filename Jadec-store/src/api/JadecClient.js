// jadec/src/api/JadecClient.js

const apiBaseUrl = import.meta.env.VITE_API_URL || "";

export const api = {
  baseUrl: apiBaseUrl,

  async request(endpoint, options = {}) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
};
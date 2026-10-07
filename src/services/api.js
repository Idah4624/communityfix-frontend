const API_BASE_URL = "http://127.0.0.1:8000";

export async function getIssues() {
  const response = await fetch(`${API_BASE_URL}/api/issues/`);

  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }

  return response.json();
}

export async function registerUser(userData) {
  const response = await fetch(
    `${API_BASE_URL}/api/accounts/register/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(
    `${API_BASE_URL}/api/accounts/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  return data;
}

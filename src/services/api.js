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

export async function createIssue(issueData) {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    throw new Error("Please log in before reporting an issue.");
  }

  const response = await fetch(`${API_BASE_URL}/api/issues/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(issueData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === "object"
        ? Object.entries(data)
            .map(([field, errors]) =>
              `${field}: ${
                Array.isArray(errors) ? errors.join(", ") : errors
              }`
            )
            .join("; ")
        : "Failed to create issue."
    );
  }

  return data;
}


export async function voteForIssue(issueId) {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    throw new Error("Please log in before voting.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/issues/${issueId}/vote/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data)
      ? data.join(" ")
      : typeof data === "string"
        ? data
        : data.detail ||
          data.non_field_errors?.[0] ||
          data.user?.[0] ||
          "Voting failed. Please try again.";

    throw new Error(message);
  }

  return data;
}


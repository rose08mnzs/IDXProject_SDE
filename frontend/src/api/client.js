const API_BASE = "/api";

function removeEmptyValues(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);

  let data = null;
  try {
    data = await response.json();
  } catch  {
    //response is not JSON
    data = null;
  }
  //Check for HTTP errors
  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status} - ${response.statusText}`;
    throw new Error(message);
  }

  return data;
}

export async function fetchProperties(params = {}) {
  const cleaned = removeEmptyValues(params);
  const query = new URLSearchParams(cleaned).toString();
  const path = query ? `/properties?${query}` : "/properties";
  return request(path);
}

export async function fetchPropertyDetail(id) {
  return request(`/properties/${id}`);
}

export async function fetchFilterOptions() {
  return request("/properties/filter-options");
}
export async function fetchPropertyOpenHouses(id) {
  return request(`/properties/${id}/openhouses`);
}
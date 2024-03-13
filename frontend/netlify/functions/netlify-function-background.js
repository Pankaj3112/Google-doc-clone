
export default async (event, context) => {
  const backendUrl = "http://3.27.164.200:8000"; // Your backend server URL
  const proxyUrl = `${backendUrl}${event.path}`; // Proxy the same path

  const response = await fetch(proxyUrl, {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body,
  });

  const data = await response.json();

  return {
    statusCode: response.status,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

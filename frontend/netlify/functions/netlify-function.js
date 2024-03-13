export default async (event, context) => {
  const backendUrl = "http://3.27.164.200:8000"; // Your backend server URL

  const url = new URL(event.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/[^/]+/, "");

  const proxyUrl = `${backendUrl}${path}`;

  try {
    const response = await fetch(proxyUrl);
	const data = await response.json();
	return Response.json(data);
  } catch (error) {
	console.log(error)
	return Response.json({});
  }
};

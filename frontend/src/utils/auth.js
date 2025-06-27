export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    return { username: payload.sub, role: payload.role };
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

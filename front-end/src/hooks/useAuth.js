export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleNames = (user?.roles || []).map((role) => role.name);

  const hasRole = (role) => roleNames.includes(role);

  const hasAnyRole = (roleList) => roleList.some((r) => roleNames.includes(r));

  return { hasRole, hasAnyRole };
};

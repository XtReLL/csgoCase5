const adminRoles = ['admin', 'super-admin'];

export const isAdminRole = (role: string): boolean => adminRoles.includes(role);

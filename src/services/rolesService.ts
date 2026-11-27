import { apiRequest } from './apiClient';

export interface RoleDto {
  id: string;
  code: string;
  name: string;
  description: string;
  scope: string;
  tags: string[];
  requiresApproval: boolean;
  subRoles?: string[];
}

export const rolesService = {
  /**
   * Retrieves all system roles and their permission scopes
   * GET /api/v1/roles
   */
  async getRoles(): Promise<RoleDto[]> {
    return apiRequest<RoleDto[]>('/roles', {
      method: 'GET',
    });
  },
};

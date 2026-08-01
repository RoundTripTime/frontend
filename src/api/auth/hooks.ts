import { useMutation } from '@tanstack/react-query';

import { logout, refreshToken, socialLogin } from '../auth';

export function useSocialLoginMutation() {
  return useMutation({ mutationFn: socialLogin });
}

export function useRefreshTokenMutation() {
  return useMutation({ mutationFn: refreshToken });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: logout });
}

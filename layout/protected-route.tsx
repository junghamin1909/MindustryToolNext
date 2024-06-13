import React, { ReactNode } from 'react';

import LoginButton from '@/components/button/login-button';
import RequireLogin from '@/components/common/require-login';
import { UserRole } from '@/constant/enum';
import { Session } from '@/types/response/Session';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  session: Session | null;
};

function NoPermission() {
  return <span>You don have permission to access this page</span>;
}

export default async function ProtectedRoute({
  all,
  any,
  children,
  session,
}: Props) {
  if (!session || session.roles.length === 0) return <RequireLogin />;

  const roles = session.roles;

  const pred = [
    all ? all.every((role) => roles.includes(role)) : true,
    any ? any.some((role) => roles.includes(role)) : true,
  ].every(Boolean);

  if (!pred) {
    return <NoPermission />;
  }

  return <>{children}</>;
}

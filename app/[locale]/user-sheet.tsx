import React, { ReactNode } from 'react';

import { ChangeLanguageDialog } from '@/app/[locale]/change-language-dialog';
import NotificationDialog from '@/app/[locale]/notification-dialog';

import { GlobIcon, SettingIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { Filter } from '@/lib/utils';

type Tab = {
  icon: ReactNode;
  action: ReactNode;
  filter?: Filter;
}[][];

const tabs: Tab = [
  [
    {
      icon: undefined,
      action: <ThemeSwitcher />,
    },
    {
      icon: <GlobIcon />,
      action: <ChangeLanguageDialog />,
    },
    {
      icon: undefined,
      action: <NotificationDialog />,
      filter: true,
    },
    {
      icon: <SettingIcon />,
      action: (
        <InternalLink className="w-full" href="/users/@me/setting">
          <Tran text="setting" />
        </InternalLink>
      ),
      filter: true,
    },
  ],
];

export function UserActions() {
  const { session } = useSession();

  return (
    <div className="space-y-4 divide-y-2 text-opacity-90">
      {tabs.map((tab, index) => (
        <div className="space-y-1" key={index}>
          {tab.map(({ action, icon, filter }, index) => (
            <ProtectedElement session={session} filter={filter} key={index}>
              <div className="grid w-full min-w-52 cursor-pointer grid-cols-[20px,1fr] items-center gap-2 rounded-sm px-1 py-2 hover:bg-brand hover:text-white" key={index}>
                {icon}
                {action}
              </div>
            </ProtectedElement>
          ))}
        </div>
      ))}
    </div>
  );
}

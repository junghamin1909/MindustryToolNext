import Link from 'next/link';
import React from 'react';

import ColorText from '@/components/common/color-text';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import Tran from '@/components/common/tran';

type ServerInstancesCardProps = {
  server: InternalServerDetail;
};

export default async function InternalServerCard({
  server: { id, name, players, port, alive, started },
}: ServerInstancesCardProps) {
  return (
    <div className="flex h-28 cursor-pointer justify-between rounded-md bg-card p-2">
      <Link className="flex flex-1 flex-col" href={`/servers/${id}`}>
        <ColorText className="text-2xl" text={name} />
        {!alive ? (
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-destructive" />
            <Tran text="server.stopped" />
          </div>
        ) : started ? (
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-success" />
            <Tran text="server.online" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-warning" />
            <Tran text="server.offline" />
          </div>
        )}
        <div className="flex justify-between gap-8">
          <div>
            <Tran text="server.players" />: {players}
          </div>
          <div>
            <Tran text="server.port" />: {port}
          </div>
        </div>
      </Link>
    </div>
  );
}

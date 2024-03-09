import ColorText from '@/components/common/color-text';
import CopyButton from '@/components/button/copy-button';
import PostServerResponse from '@/types/response/PostServerResponse';

type PostServerResultCardProps = {
  server?: PostServerResponse;
};

export default function PostServerResultCard({
  server,
}: PostServerResultCardProps) {
  if (!server) {
    return;
  }

  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-md font-medium">
      <CopyButton
        className="justify-start px-0 text-xl text-foreground"
        content={server.address}
        data={server.address}
        variant="ghost"
      >
        <ColorText
          className="overflow-hidden whitespace-nowrap"
          text={server.name ? server.name : server.address}
        />
      </CopyButton>
      <section className="flex h-full flex-col overflow-hidden rounded-sm">
        <div className="flex h-full flex-col justify-between">
          <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
            <div className="flex gap-2">
              <span>{server.players}</span>
              {server.playerLimit ? (
                <>
                  <span>/</span>
                  <span>{server.playerLimit}</span>
                </>
              ) : (
                ''
              )}
              players
            </div>
            <span className="flex flex-row gap-2">Wave: {server.wave}</span>
            <span className="flex flex-row gap-2">
              Map: <ColorText text={server.mapname} />
            </span>
            <span className="capitalize">
              Version:
              {server.version === -1 ? server.versionType : server.version}
            </span>
            <span>
              Status:
              {server.online ? 'Online' : 'Offline'}
            </span>
            <span className="overflow-hidden whitespace-nowrap capitalize">
              Game mode:
              {server.modeName ? server.mapname : server.mode}
            </span>
          </div>
          <span className="col-span-full">
            Address:
            {server.address}
          </span>
          {server.description && (
            <div className="col-span-full">
              Description: <ColorText text={server.description} />
            </div>
          )}
          <span>Ping: {server.ping}ms</span>
        </div>
      </section>
    </div>
  );
}

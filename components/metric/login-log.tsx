import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';
import { isError } from '@/lib/utils';
import { getLogs } from '@/query/log';
import { Log } from '@/types/response/Log';

export default async function LoginLog() {
  return (
    <MetricWrapper>
      <LoginTable />
    </MetricWrapper>
  );
}

type LoginLogCardProps = {
  log: Log;
};

async function LoginTable() {
  const data = await serverApi((axios) => getLogs(axios, { page: 0, collection: 'USER_LOGIN' }));

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  return (
    <div className="flex min-h-[500px] w-full flex-col gap-2 bg-card p-2">
      <span className="font-bold">
        <Tran text="metric.user-login-history" />
      </span>
      <div>
        <section className="grid h-[450px] gap-2 overflow-y-auto">
          {data.map((log) => (
            <LoginLogCard key={log.id} log={log} />
          ))}
        </section>
      </div>
    </div>
  );
}

function LoginLogCard({ log: { id, content, ip, createdAt } }: LoginLogCardProps) {
  const from = new Date(createdAt).toLocaleString();

  return (
    <span className="flex justify-between gap-8 rounded-sm bg-background p-4" key={id}>
      <span>{`${content} ${from}`}</span>
      <span>{ip}</span>
    </span>
  );
}

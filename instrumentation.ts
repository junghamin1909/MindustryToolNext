export function onRequestError(
  error: { digest: string } & Error,
  request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
  context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
    renderSource: 'react-server-components' | 'react-server-components-payload' | 'server-rendering';
    revalidateReason: 'on-demand' | 'stale' | undefined;
    renderType: 'dynamic' | 'dynamic-resume';
  },
): void | Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    try {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: JSON.stringify({ error: JSON.stringify(error, Object.getOwnPropertyNames(error)), request, context }) }),
      });
    } catch (error) {
      //
    }
  }
}

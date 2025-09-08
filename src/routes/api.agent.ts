import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { runAgent } from '~/lib/agents';

export async function action({ request }: ActionFunctionArgs) {
  const { sessionId = 'default', input } = await request.json<{ sessionId?: string; input: string }>();
  const steps = await runAgent(sessionId, input);

  return new Response(JSON.stringify({ steps }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { generateText } from 'ai';
import { LLMManager } from '~/lib/modules/llm/manager';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '~/utils/constants';

export async function action({ request, context }: ActionFunctionArgs) {
  const { prompt } = await request.json<{ prompt: string }>();

  const manager = LLMManager.getInstance((context.cloudflare?.env as any) || {});
  const provider = manager.getProvider(DEFAULT_PROVIDER.name) || manager.getDefaultProvider();
  const model = provider.getModelInstance({
    model: DEFAULT_MODEL,
    serverEnv: context.cloudflare?.env,
  });

  const resp = await generateText({
    model,
    system:
      'You are a project planning assistant. Given a project description, ' +
      'generate a concise project plan and a list of development rules in markdown. ' +
      'Output using the following format:\n<plan>\n# Project Plan\n- [ ] task\n</plan>\n<rules>\n# Rules\n- rule\n</rules>',
    prompt,
  });

  const text = resp.text;
  const planMatch = text.match(/<plan>([\s\S]*?)<\/plan>/i);
  const rulesMatch = text.match(/<rules>([\s\S]*?)<\/rules>/i);

  return json({
    plan: planMatch ? planMatch[1].trim() : '',
    rules: rulesMatch ? rulesMatch[1].trim() : '',
  });
}

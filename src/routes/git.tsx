import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { GitUrlImport } from '~/components/git/GitUrlImport.client';

export const meta: MetaFunction = () => {
  return [{ title: 'CodeLaunch - Git Import' }, { name: 'description', content: 'Import Git repositories with CodeLaunch' }];
};

export async function loader(args: LoaderFunctionArgs) {
  return json({ url: args.params.url });
}

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full" style={{ background: 'var(--ink, #0B1020)' }}>
      <ClientOnly fallback={<BaseChat />}>{() => <GitUrlImport />}</ClientOnly>
    </div>
  );
}

import { json } from '@remix-run/cloudflare';
import { FLUTTER_BASIC_TEMPLATE } from '~/templates/flutter-basic';

// قاعدة بيانات القوالب المحلية
const LOCAL_TEMPLATES: Record<string, any> = {
  'flutter-basic': FLUTTER_BASIC_TEMPLATE,
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const templateName = url.searchParams.get('template');

  if (!templateName) {
    return json({ error: 'Template name is required' }, { status: 400 });
  }

  const template = LOCAL_TEMPLATES[templateName];

  if (!template) {
    return json(
      {
        error: 'Template not found',
        message: `Local template "${templateName}" does not exist`,
        available: Object.keys(LOCAL_TEMPLATES),
      },
      { status: 404 },
    );
  }

  try {
    // إرجاع ملفات القالب
    return json({
      name: template.name,
      description: template.description,
      files: template.files,
      isLocal: true,
    });
  } catch (error) {
    console.error('Error loading local template:', error);

    return json(
      {
        error: 'Failed to load template',
        message: `Could not load local template "${templateName}"`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

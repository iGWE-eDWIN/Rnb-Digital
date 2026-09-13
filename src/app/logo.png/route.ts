import { LOGO_IMAGE_SRC } from '@/lib/logo-base64';

export async function GET() {
  const base64Data = LOGO_IMAGE_SRC.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

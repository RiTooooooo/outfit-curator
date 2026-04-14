import { http, type RequestHandler } from 'msw';
import * as route_1sdc078 from '../src/app/api/diagnoses/route';
import * as route_14ma3l5 from '../src/app/api/outfits/route';
import * as route_1tv9jko from '../src/app/api/questions/route';

export const patchDuplicateCookie = (req: Request): Request => {
  const cookie = req.headers.get('cookie');

  if (cookie) {
    const unique = [...new Set(cookie.split(/,\s*/).flatMap((s) => s.split('; ')))];
    req.headers.set('cookie', unique.join('; '));
  }

  return req;
};

export function setupMswHandlers(option?: { baseURL: string }): RequestHandler[] {
  const baseURL = option?.baseURL.replace(/\/$/, '') ?? '';

  return [
    http.post(`${baseURL}/api/diagnoses`, ({ request }) => {
      return route_1sdc078.POST(patchDuplicateCookie(request));
    }),
    http.get(`${baseURL}/api/outfits`, ({ request }) => {
      return route_14ma3l5.GET(patchDuplicateCookie(request));
    }),
    http.get(`${baseURL}/api/questions`, ({ request }) => {
      return route_1tv9jko.GET(patchDuplicateCookie(request));
    }),
  ];
}

export function patchFilePrototype(): void {
  File.prototype.arrayBuffer ??= function (): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };

  File.prototype.bytes ??= function (): Promise<Uint8Array<ArrayBuffer>> {
    return new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };

  File.prototype.stream ??= function (): ReadableStream<Uint8Array<ArrayBuffer>> {
    return new ReadableStream({
      start: (controller): void => {
        const reader = new FileReader();

        reader.onload = (): void => {
          const arrayBuffer = reader.result as ArrayBuffer;
          controller.enqueue(new Uint8Array(arrayBuffer));
          controller.close();
        };
        reader.onerror = (): void => {
          controller.error(reader.error);
        };
        reader.readAsArrayBuffer(this);
      },
    });
  };

  File.prototype.text ??= function (): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(this);
    });
  };
}

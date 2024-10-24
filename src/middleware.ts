// https://vercel.com/docs/functions/edge-middleware/middleware-api
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};

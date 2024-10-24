export const edge = true;

export default async function handler(request: Request) {
  console.log('yes',request.method);
  
  return new Response(JSON.stringify({ status: 'success', data: null }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
  });
}
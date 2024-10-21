// https://github.com/omniti-labs/jsend

function handleProducts(request: Request)  {
    const { method } = request;
    switch (method) {
        case 'GET':
            return new Response(JSON.stringify({status: 'success',data:{}}), {
                headers: { 'Content-Type': 'application/json' },
            });
        default:
            return new Response('Not Found', { status: 404 });
    }
}

function handleHealthCheck(request: Request) {
    const { method } = request;
    switch (method) {
        case 'HEAD':
        case 'GET':
            console.log('yes');
            
            return new Response(JSON.stringify({ status: 'success', data: null }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        default:
            return new Response('Not Found', { status: 404 });
    }
}

const server = Bun.serve({
    port: 9001,
    fetch(request: Request) {
        const { pathname } = new URL(request.url);
        const domain = pathname.split('/')[3]

        // if (pathname === '/') {
        //     return new Reposn
        // }

        switch (domain) {
            case 'product':
                return handleProducts(request)
            case 'health':
                return handleHealthCheck(request)
            default:
                return new Response('Not Found', { status: 404 })
        }
    }
});
  
  console.log(`Listening on http://localhost:${server.port} ...`);
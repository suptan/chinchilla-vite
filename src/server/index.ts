import { MemoryCache } from 'memory-cache-node';
import axios from "axios";
import * as cheerio from "cheerio";

const itemsExpirationCheckIntervalInSecs = 60 * 60;
const maxItemCount = 1000000;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new MemoryCache<string, any>(itemsExpirationCheckIntervalInSecs, maxItemCount);

// https://github.com/omniti-labs/jsend
async function handleProducts(request: Request)  {
    const { method } = request;
    switch (method) {
        case 'GET': {
            const pageHTML = await axios.get("https://chinchillagallery.royalchinchilla.com/category/wait/wisteria/")
            const $ = cheerio.load(pageHTML.data)
            const detailURLs:string[] = []

            $(".grid_post-box").each((_, element) => { 
                const dataHref = $(element).children().attr("data-href")

                if (!dataHref) {
                    return
                }

                detailURLs.push(dataHref)
            })
            // console.log("🚀 ~ $ ~ detailURL:", detailURLs)
            // const detailHTMLs = await Promise.all(detailURLs.map(normalizeDetail))
            const detailHTMLs = await normalizeDetail(detailURLs[0])

            console.log("🚀 ~ handleProducts ~ detailHTMLs:", detailHTMLs)

            return new Response(JSON.stringify({status: 'success',data:{}}), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        default:
            return new Response('Not Found', { status: 404 });
    }
}

async function normalizeDetail(url: string)  {
    const paths = url.split('/')
    const id = paths[paths.length - 2]
    const key = `rycw-${id}`

    // if (memoryCache.hasItem(key)) {
    //     return memoryCache.retrieveItemValue(key)
    // }
let $: cheerio.CheerioAPI
    if (memoryCache.hasItem(key)) {
        $ = memoryCache.retrieveItemValue(key)
    } else {
     
    const pageHTML = await axios.get(url)
    $ = cheerio.load(pageHTML.data)
    memoryCache.storePermanentItem(key, $)   
    }

    const title = $(".single-post-title").text()
    const body = $(".single-post-main")
    const color = body.find('table > tr[2] > td[1]').text();
    const gender = body.find('table > tr[3] > td[1]').text();
    const birthday = body.find('table > tr[4] > td[1]').text();
    const price = body.find('table > tr[7] > td[1]').text();
    const model ={
        id,
        birthday,
        color,
        gender,
        price,
        // rcno,
        source: 'Royal Chin Wis',
        title,
        // updatedAt,
    } 
    //// memoryCache.storePermanentItem(key, model)
    console.log("🚀 ~ normalizeDetail ~ model:", model)

    return model
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
            case 'products':
                return handleProducts(request)
            case 'health':
                return handleHealthCheck(request)
            default:
                return new Response('Not Found', { status: 404 })
        }
    }
});
  
  console.log(`Listening on http://localhost:${server.port} ...`);


//   concurrently wait-on cheerio axios memory-cache-node @types/bun
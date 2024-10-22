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
            const detailURLs = $(".grid_post-box").map((_, element) => $(element).children().attr("data-href")).filter(Boolean)
            // console.log("🚀 ~ $ ~ detailURL:", detailURLs)
            const detailHTMLs = await Promise.all(detailURLs.map((_, ele) => normalizeDetail(ele)))
            // const detailHTMLs = await normalizeDetail(detailURLs[0])

            // console.log("🚀 ~ handleProducts ~ detailHTMLs:", detailHTMLs)

            return new Response(JSON.stringify({status: 'success',data: { products: [detailHTMLs] }}), {
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

    if (memoryCache.hasItem(key)) {
        console.log('cache',url)
        return memoryCache.retrieveItemValue(key)
    }
// let $: cheerio.CheerioAPI
//     if (memoryCache.hasItem(key)) {
//     console.log('cahe',url)
//         $ = memoryCache.retrieveItemValue(key)
//     } else {
//      console.log('fetdch',url);
     
//     const pageHTML = await axios.get(url)
//     $ = cheerio.load(pageHTML.data)
//     memoryCache.storePermanentItem(key, $)   
//     }
    const pageHTML = await axios.get(url)
    console.log('fetch',url)
    const $ = cheerio.load(pageHTML.data)
    memoryCache.storePermanentItem(key, $)   
    const title = $(".single-post-title").text()
    const updatedAt = $('.single-post-date').attr('datetime')
    const body = $(".single-post-main")
    const color = body.find('table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
    const gender = body.find('table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
    const birthday = body.find('table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
    const price = body.find('table > tbody > tr:nth-child(6) > td:nth-child(2)').text();
    const gallery = $('.wp-block-gallery')
    const album: { src?: string }[] = []
    
    $(gallery).children().each((_, element) => {
        const img = $(element).find('img')

        album.push({
            src: img.attr('src') || img.attr('data-src'),
        })
    })

    const model ={
        album,
        id,
        birthday,
        color,
        gender,
        price,
        // rcno,
        source: 'Royal Chin Wis',
        title,
        updatedAt,
    } 
    memoryCache.storePermanentItem(key, model)
    // console.log("🚀 ~ normalizeDetail ~ model:", model)

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

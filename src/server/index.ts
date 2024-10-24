import { MemoryCache } from 'memory-cache-node';
// import axios from "axios";
import * as cheerio from "cheerio";
import { Elysia } from 'elysia'
import { landpage } from './landpage';
import { cors } from "@elysiajs/cors";
import { chi1 } from './chi1';

const itemsExpirationCheckIntervalInSecs = 24 * 60 * 60;
const maxItemCount = 1000000;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new MemoryCache<string, any>(itemsExpirationCheckIntervalInSecs, maxItemCount);

// https://github.com/omniti-labs/jsend
async function handleProducts()  {
    // const { method } = request;
    // switch (method) {
    //     case 'GET': {
            // const pageHTML = await axios.get("https://chinchillagallery.royalchinchilla.com/category/wait/wisteria/")
            // const $ = cheerio.load(pageHTML.data)
            const $ = cheerio.load(landpage)
            const detailURLs = $(".grid_post-box").map((_, element) => $(element).children().attr("data-href")).filter(Boolean)
            // console.log("🚀 ~ $ ~ detailURL:", detailURLs)
            const detailHTMLs = await Promise.all(detailURLs.slice(0,3).map((_, ele) => normalizeDetail(ele)))
            // const detailHTMLs = await normalizeDetail(detailURLs[0])

            // console.log("🚀 ~ handleProducts ~ detailHTMLs:", detailHTMLs)

            return {status: 'success',data: detailHTMLs };
    //     }
    //     default:
    //         return new Response('Not Found', { status: 404 });
    // }
}

async function normalizeDetail(url: string)  {
    const paths = url.split('/')
    const id = +paths[paths.length - 2]
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
    // const pageHTML = await axios.get(url)
    // const $ = cheerio.load(pageHTML.data)
    console.log('fetch',url)
    const $ = cheerio.load(chi1)
    memoryCache.storePermanentItem(key, $)   
    const title = $(".single-post-title").text()
    const updatedAt = $('.single-post-date').attr('datetime')
    const body = $(".single-post-main")
    const color = body.find('table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
    const gender = body.find('table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
    const birthday = body.find('table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
    const price = body.find('table > tbody > tr:nth-child(8) > td:nth-child(2)').text();
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
        source: 'Wisteria',
        title,
        updatedAt,
    } 
    memoryCache.storePermanentItem(key, model)
    // console.log("🚀 ~ normalizeDetail ~ model:", model)

    return model
}

function handleHealthCheck() {
    console.log('yes');
    
    return new Response(JSON.stringify({ status: 'success', data: null }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}

// const server = Bun.serve({
//     port: 9001,
//     fetch(request: Request) {
//         const { pathname } = new URL(request.url);
//         const domain = pathname.split('/')[3]

//         // if (pathname === '/') {
//         //     return new Reposn
//         // }

//         switch (domain) {
//             case 'products':
//                 return handleProducts(request)
//             case 'health':
//                 return handleHealthCheck(request)
//             default:
//                 return new Response('Not Found', { status: 404 })
//         }
//     }
// });
// console.log(`Listening on http://localhost:${server.port} ...`);
const app = new Elysia({
    prefix: '/api'
})
    .use(cors())
    .get('/', () => 'Hello World')
    // .get('/api/v1', () => 'cc')
    .group('/v1', (app) =>
        app
            .get('/products', () => handleProducts())
            .get('/health', () => handleHealthCheck())
    )
    .onError(({ error, code,...rest }) => { 
        console.log('ee',error,code,rest.path)
        if (code === 'NOT_FOUND') {
            return 'Route not found :('
        }

        console.error(error) 
    })
    .listen(9001)
  
// app.use(cors());

// app.get('/', () => {console.log('hi')})
// app.get('/api/v1/products', handleProducts)
// app.get('/api/v1/health', handleHealthCheck)
// console.log('start');

// app.listen(9001)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

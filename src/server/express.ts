import express from "express";
import { MemoryCache } from 'memory-cache-node';
// import axios from "axios";
import * as cheerio from "cheerio";
import { landpage } from './landpage';
import { chi1 } from './chi1';

const itemsExpirationCheckIntervalInSecs = 24 * 60 * 60;
const maxItemCount = 1000000;
const memoryCache = new MemoryCache(itemsExpirationCheckIntervalInSecs, maxItemCount);

const app = express();
const router = express.Router();

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

router.get("/products", async function(req, res) {
  console.log("method", req.method);
  const $ = cheerio.load(landpage)
            const detailURLs = $(".grid_post-box").map((_, element) => $(element).children().attr("data-href")).filter(Boolean)
            // console.log("🚀 ~ $ ~ detailURL:", detailURLs)
            const detailHTMLs = await Promise.all(detailURLs.slice(0,3).map((_, ele) => normalizeDetail(ele)))
            // const detailHTMLs = await normalizeDetail(detailURLs[0])

            // console.log("🚀 ~ handleProducts ~ detailHTMLs:", detailHTMLs)
try {
  res.send({status: 'succeess',data: detailHTMLs });
  
} catch (_) {
  res.status(400).send({ status: 'failed', data:'Bad Request'})
}
})

router.get("/health", function (req, res) {
  console.log("method", req.method);

// https://github.com/omniti-labs/jsend
  res.send({ status: "success", data: "Alive" });
});

app.use("/api/:version/", router);

app.listen(9001, () => {
  console.log("Server running on http://localhost:9001");
});

import express from "express";
import { MemoryCache } from 'memory-cache-node';
import axios from "axios";
import * as cheerio from "cheerio";
// import { landpage } from './landpage';
// import { chi1 } from './chi1';
// import { chi2 } from './chi2';
// import { chi3 } from './chi3';
// import { chino } from "./chino";

const itemsExpirationCheckIntervalInSecs = 24 * 60 * 60;
const maxItemCount = 1000000;
const memoryCache = new MemoryCache(itemsExpirationCheckIntervalInSecs, maxItemCount);

const app = express();
const router = express.Router();

function normalizeDetail(id:number, htmlData: string)  {
  const $ = cheerio.load(htmlData)
  const title = $(".single-post-title").text()
  const updatedAt = $('.single-post-date').attr('datetime')
  const body = $(".single-post-main")
  const color = body.find('table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
  const gender = body.find('table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
  const birthday = body.find('table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
  const price = body.find('table > tbody > tr:nth-child(8) > td:nth-child(2)').text();
  const gallery = $('.wp-block-image')
  const album: { src?: string }[] = []
  
  $(gallery).each((_, element) => {
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

  return model
}

// @ts-ignore
async function fetchDetail(url: string) {
  const paths = url.split('/')
  const id = +paths[paths.length - 2]
  const key = `rycw-${id}`

  if (memoryCache.hasItem(key)) {
    console.log('cache',url)
    return memoryCache.retrieveItemValue(key)
  }
  
  const pageHTML = await axios.get(url)
  const model = normalizeDetail(id, pageHTML.data)
  memoryCache.storePermanentItem(key, model)

  return model
}

// @ts-ignore
function mockFetchDetail(_:string, i:number) {
  const id = i+1
  const key = `rycw-${i}`

  if (memoryCache.hasItem(key)) {
    console.log('cache',key)
    return memoryCache.retrieveItemValue(key)
  }

  // const model = normalizeDetail(id, [chi1,chi2,chi3][i])
  const model = { id }
  memoryCache.storePermanentItem(key, model)

  return model
}

router.get("/products", async function(req, res) {
  console.log("method", req.method, req.params, req.query);
  const { pages } = req.query
  const pageUrl = `https://chinchillagallery.royalchinchilla.com/category/wait/wisteria/${Number(pages) ? `page/${pages}` : ''}`
  console.log('url', pageUrl);
  
  const pageHTML = await axios.get(pageUrl)
  const $ = cheerio.load(pageHTML.data)
  // const $ = cheerio.load(Number(pages) === 3 ? chino : landpage)

  if ($('notfofund_title').length) {
    res.status(404).send({ status: 'failed', data:'Not Found'})
  }

  const detailURLs = $(".grid_post-box").map((_, element) => $(element).children().attr("data-href")).filter(Boolean)
  // const detailHTMLs = await Promise.all(detailURLs.slice(0,3).map((_, ele) => mockFetchDetail(ele,_)))
  const detailHTMLs = await Promise.all(detailURLs.map((_, ele) => fetchDetail(ele)))

  try {
    res.send({status: 'succeess',data: detailHTMLs });
    
  } catch (_) {
    res.status(400).send({ status: 'failed', data:'Bad Request'})
  }
})

router.get("/health", function (req, res) {
  // console.log("method", req.method);

// https://github.com/omniti-labs/jsend
  res.send({ status: "success", data: "Alive" });
});

app.use("/api/:version/", router);

app.listen(9001, () => {
  console.log("Server running on http://localhost:9001");
});

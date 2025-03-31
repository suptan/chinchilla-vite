import express, { Request } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { Shop } from "./constants";
import { fetchWisteriaDetail } from "./services/wisteria";
import { fetchKojimaDetail } from "./services/kojima";
// import { mockFetchKojima } from "./services/kojima";
// import { landpage } from "./landpage";
// import { chi1 } from './chi1';
// import { chi2 } from './chi2';
// import { chi3 } from './chi3';
// import { chino } from "./chino";


const app = express();
const router = express.Router();

interface ProductsRequest extends Omit<Request, 'query'> {
  query: {
    pages: string,
    shop: Shop
  }
}

async function searchWisteria(pages: string) {
  const pageUrl = `https://chinchillagallery.royalchinchilla.com/category/wait/wisteria/${Number(pages) ? `page/${pages}` : ''}`
  console.log('url', pageUrl);
  
  const pageHTML = await axios.get(pageUrl)
  const $ = cheerio.load(pageHTML.data)
  // const $ = cheerio.load(Number(pages) === 3 ? chino : landpage)

  if ($('notfofund_title').length) {
    return {
      code: 404,
      status: 'failed',
      data:'Not Found',
    }
  }

  const detailURLs = $(".grid_post-box").map((_, element) => $(element).children().attr("data-href"))
  // return await Promise.all(detailURLs.slice(0,3).map((_, ele) => mockFetchWisteriaDetail(ele,_)))
  return {
    status: 'succeess',
    data: await Promise.all(detailURLs.map((_, ele) => fetchWisteriaDetail(ele))),
  } 
}

async function searchKojima(page = '1') {
  const pageUrl = `https://pets-kojima.com/small_list/?topics_group_id=4&group=6&breed=&shop%5B0%5D=&freeword=&price_bottom=&price_upper=&order_type=2&pageID=${page}`
  // console.log('url', pageUrl);

  const pageHTML = await axios.get(pageUrl)
  const $ = cheerio.load(pageHTML.data)
  
  if ($('#page_notfound').length) {
    return {
      code: 404,
      status: 'failed',
      data:'Not Found',
    }
  }

  const detailURLs = $("#topics_list4 li").map((_, element) => $(element).children().attr("data-calink"))

  return {
    status: 'succeess',
    // data: Array(2).fill('').map(mockFetchKojima),
    data: await Promise.all(detailURLs.map((_, ele) => fetchKojimaDetail(ele))),
  } 
}

router.get("/products", async function(req: ProductsRequest, res) {
  // console.log("method", req.method, req.params, req.query);
  const { pages, shop } = req.query
  // console.log('shop', shop, shop === Shop.KOJIMA);
  

  try {
    let body = { status: 'failed', data: 'Not Found' } as { status: string, data: unknown }
    switch (shop) {
      case Shop.WISTERIA:
        body = await searchWisteria(pages)
        break;
      case Shop.KOJIMA:
        body = await searchKojima(pages)
        // console.log('body',body);
        break;
      default:
        throw new Error('Bad Request')
        break;
    }
    res.send(body);
  } catch (err) {
    console.log('Fetch error', err);
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

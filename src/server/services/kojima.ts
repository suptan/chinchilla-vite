import axios from "axios"
import { memoryCache } from "../cache"
import * as cheerio from "cheerio";
import { koji1 } from "../koji1";

function normalizeKojimaDetail(id: number, htmlData: string) {
  const $ = cheerio.load(htmlData)
  const title = $(".h2-ca-basic01").text().trim()
//   const regisAt = $(".dl-post-date > dd:nth-child(2)").text()
  const updatedAt = $(".dl-post-date > dd:nth-child(4)").text()
//   const remarks = $(".dl-table-ca00 > tr:nth-child(3) > dd").text()
  const price = $(".offer-price > dd:nth-child(3)").text()
  const newIcon = $(".ico-ca-square").text()
  const album: { src?: string }[] = []
//   console.log($('.ca-detail-img').html())
  $('.ca-detail-img > li').map((_, element) => {
    const img = $(element).find('img')

    album.push({
      src: `https://pets-kojima.com${img.attr('src')}`,
    })
  })
  
  return {
    album,
    id,
    // birthday,
    // color,
    isNew: Boolean(newIcon),
//   gender,
    price,
    source: 'Kojima',
    title,
    updatedAt,
  }
}

export async function fetchKojimaDetail(url: string) {
    const idStartIdx = url.indexOf('=')
    const id = +url.substring(idStartIdx + 1)
    const key = `pkj-${id}`

    if (memoryCache.hasItem(key)) {
        console.log('cache',url)
        return memoryCache.retrieveItemValue(key)
    }

    const pageHTML = await axios.get(`https://pets-kojima.com${url}`)
    const model = normalizeKojimaDetail(id, pageHTML.data)
    memoryCache.storePermanentItem(key, model)

    return model
}

export function mockFetchKojima() {
    const model = normalizeKojimaDetail(Math.ceil(Math.random() * 10), koji1)
    return model
}

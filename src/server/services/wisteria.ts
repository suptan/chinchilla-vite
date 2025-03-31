import axios from "axios"
import { memoryCache } from "../cache"
import * as cheerio from "cheerio";

function normalizeWisteriaDetail(id: number, htmlData: string)  {
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
  
    const model = {
        album: album.slice(0, -2),
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
export async function fetchWisteriaDetail(url: string) {
    const paths = url.split('/')
    const id = +paths[paths.length - 2]
    const key = `rycw-${id}`

    if (memoryCache.hasItem(key)) {
        console.log('cache',url)
        return memoryCache.retrieveItemValue(key)
    }

    const pageHTML = await axios.get(url)
    const model = normalizeWisteriaDetail(id, pageHTML.data)
    memoryCache.storePermanentItem(key, model)

    return model
}

// @ts-ignore
export function mockFetchWisteriaDetail(_:string, i:number) {
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

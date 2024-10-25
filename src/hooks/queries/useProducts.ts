import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { NUMERIC_REGEXP } from "../../utils/regex"

interface ApiResponse<T> {
  status: string
  data: T
}

export interface ProductResponse {
  album: { src: string }[]
  birthday: string
  color: string
  gender: string
  id: number
  price: string
  source: string
  title: string
  updatedAt: string
}

export interface Product extends Omit<ProductResponse, 'updatedAt'> {
  // birthday: Date
  displayPrice: string
  updatedAt: Date
}

export const productsKeys = {
    all: ['products'] as const
}

export function useProducts() {
  return useInfiniteQuery({
    queryKey: productsKeys.all,
    queryFn: ({ signal, pageParam }) =>  axios.get<ApiResponse<ProductResponse[]>>('/api/v1/products', { signal, params: { pages: pageParam } }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.data.length ? allPages.length + 1 : undefined;
    },
    select: ({ pages }) => pages.reduce((acc, res) => {
      res.data.data.forEach((item) => {
          acc.push({
            ...item,
            // birthday: new Date(item.birthday),
            displayPrice: item.price.match(NUMERIC_REGEXP)?.join('') || '', 
            updatedAt: new Date(item.updatedAt),
          })
        })
      return acc
    }, [] as Product[])
  })
}

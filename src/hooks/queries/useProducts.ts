import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { NUMERIC_REGEXP } from "../../utils/regex"
import { useParams } from "react-router-dom"

interface ApiResponse<T> {
  status: string
  data: T
}

export interface ProductResponse {
  album: { src: string }[]
  birthday?: string
  color?: string
  gender?: string
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
    all: ['products'] as const,
    listAll: () => [...productsKeys.all, 'list'] as const,
    list: (filters: any) => [...productsKeys.listAll(), { filters }] as const,
}

export function useProducts() {
  const {shop} = useParams();

  return useInfiniteQuery({
    queryKey: productsKeys.all,
    queryFn: ({ signal, pageParam }) =>  axios.get<ApiResponse<ProductResponse[]>>('/api/v1/products', { signal, params: { pages: pageParam, shop } }),
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

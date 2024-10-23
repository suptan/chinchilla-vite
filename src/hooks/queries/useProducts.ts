import { useQuery } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"
import { NUMERIC_REGEXP } from "../../utils/regex"

interface ApiResponse<T> {
  status: string
  data: T
}

export interface ProductResponse {
  album: { src: string }
  birthday: string
  color: string
  gender: string
  id: number
  price: string
  source: string
  title: string
  updatedAt: string
}

export interface Product extends Omit<ProductResponse, 'birthday' | 'updatedAt'> {
  // birthday: Date
  updatedAt: Date
}

export const productsKeys = {
    all: ['products'] as const
}

export function useProducts() {
  return useQuery({
    queryKey: productsKeys.all,
    queryFn: ({ signal }) =>  axios.get<ApiResponse<ProductResponse[]>>('/api/v1/products', {signal}),
    select: ({ data }) => {
      console.log('m',data,'n',data.data);
      
      return data.data.map((item) => ({
        ...item,
        // birthday: new Date(item.birthday),
        displayPrice: item.price.match(NUMERIC_REGEXP)?.join(''), 
        updatedAt: new Date(item.updatedAt),
      }))
    }
  })
}

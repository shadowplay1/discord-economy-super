import CustomItemData from '../interfaces/CustomItemData'

export interface ItemProperties<T extends object = any> {
    id: number
    name: string
    description: string
    price: number
    message: string
    maxAmount: number
    role: string
    date: string
    custom: CustomItemData<T>
}

export type ItemPropertyType<T extends keyof ItemProperties> = T extends 'custom' ? object : ItemProperties[T]
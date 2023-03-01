import ShopItem from '../classes/ShopItem'


interface ShopOperationInfo<T extends object> {

    /**
     * Operation status.
     */
    status: boolean

    /**
     * Operation message.
     */
    message: string

    /**
     * Item object.
     */
    item: ShopItem<T>

    /**
     * Item quantity.
     */
    quantity?: number

    /**
     * Total price of the items.
     */
    totalPrice: number
}

export = ShopOperationInfo
import InventoryItem from '../classes/InventoryItem'

interface StackedInventoryItemObject<T extends object = any> {
    quantity: number
    totalPrice: number
    item: InventoryItem<T>
}

export = StackedInventoryItemObject
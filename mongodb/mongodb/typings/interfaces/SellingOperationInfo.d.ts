import InventoryItem from '../classes/InventoryItem'
import ShopOperationInfo from './ShopOperationInfo'

type SellingOperationInfo<T extends object = any> = Exclude<ShopOperationInfo<T>, 'item'> & {
    
    /**
     * Inventory item object.
     */
    item: InventoryItem<T>
}

export = SellingOperationInfo
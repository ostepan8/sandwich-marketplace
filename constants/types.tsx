export interface AddOn {
    name: String;
    additionalCost: number;
}

export type Ingredient = {
    name: String,
    available: Boolean,
    _id: String,
    type: String,
}
export interface IngredientProps {
    data: Ingredient,
}

export type MenuItem = {
    _id: String;
    name: String;
    description?: String;
    basePrice: number;
    ingredients: Ingredient[];
    available: Boolean;
}

export interface MenuItemProps {
    data: MenuItem;
}
export interface MenuAndIngredientProps {
    _id: String,
    name?: String,
    title?: String,
    available?: Boolean,
    description?: String,
    basePrice?: Number,
    ingredients?: Ingredient[],
    addOns?: AddOn[];
    type?: String
}
export interface CartItem {
    menuItem?: MenuItem;  // This can be undefined if it's a custom item
    merchItem?: MerchItem;
    customDetails?: {     // Details specific to custom sandwiches
        name: string;
        ingredients: string[];
        price: number;
        size: string
    };
    quantity: number;
}

export interface MerchItemProps {
    item: MerchItem
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: MenuItem | MerchItem) => void;
    removeFromCart: (_id: string) => void;
    updateQuantity: (_id: string, quantity: number) => void;
    clearCart: () => void;
    loading: boolean
}
export interface ITransaction {
    createdAt: Date;
    stripeId: string;
    amount: number;
    cartItems: CartItem[];
    pickUpTime: string
    completed: boolean
}
export interface DatabaseTransaction {
    _id: string;
    createdAt: Date;
    stripeId: string;
    amount: number;
    cartItems: {
        name: string;
        quantity: number,
        ingredients: Ingredient[]
    }[];
    pickUpTime: string;
    completed: boolean;
    email?: string;
    name?: string
}
export type GetAllDataToReturn = {
    menuData: MenuItem[],
    ingredientData: Ingredient[],
    transactions: DatabaseTransaction[]
}
export type MerchItem = {
    name: string,
    basePrice: number,
    description?: string,
    available: boolean,
    _id: string,
    imagePath: string
    size?: string
}
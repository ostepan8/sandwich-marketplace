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
    basePrice: Number;
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
    menuItem: MenuItem;
    quantity: Number;
}


export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (_id: string) => void;
    updateQuantity: (_id: string, quantity: number) => void;
    clearCart: () => void;
}

export class Product {
    constructor(
        public title: string
    ) {}

    save() {
        products.push(this);
    }

    static fetchAll() {
        return products;
    }
}

const products: Product[] = [];

export class CreateProductDTO {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string
    ) {};

    static create( object: { [key: string]: any } ): [ string?, CreateProductDTO? ] {
        const { name, available, price, description, user, category } = object;

        if ( !name ) return [ 'Missing name' ];
        if ( !user ) return [ 'Missing user' ];
        if ( !category ) return [ 'Missing category' ];

        return [ undefined, new CreateProductDTO( name, !!available, price, description, user, category ) ];
    };

};
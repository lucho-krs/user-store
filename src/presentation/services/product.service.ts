import { ProductModel } from '../../data';
import { CreateProductDTO, CustomError, PaginationDTO } from '../../domain';

export class ProductService {

    constructor() {};

    async createProduct( createProductDTO: CreateProductDTO ) {
        const existProduct = await ProductModel.findOne({ name: createProductDTO.name });
        if ( existProduct ) throw CustomError.badRequest( 'Product already exist' );

        try {
            const product = new ProductModel( createProductDTO );
            await product.save();

            return product;
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        };
    };

    async getProducts( paginationDTO: PaginationDTO ) {
        const { page, limit } = paginationDTO;

        try {
            const [ total, products ] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip( ( page - 1 ) * limit )
                    .limit( limit )
            ]);
            
            return {
                page,
                limit,
                total,
                next: `/api/products?page=${( page + 1 )}&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/products?page=${( page + 1 )}&limit=${ limit }` : null,
                products: products.map( category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            };
        } catch ( error ) {
            throw CustomError.internalServer(`${ error }`);
        };
    };

};
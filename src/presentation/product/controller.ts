import { Request, Response } from 'express';
import { CreateProductDTO, CustomError, PaginationDTO } from '../../domain';
import { ProductService } from '../services/product.service';

export class ProductController {

    constructor(
        public readonly productService: ProductService
    ) {};

    private handleError = ( error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message });
        };
            
        console.log(`${ error }`);
        return res.status( 500 ).json({ error: 'Internal server error' });
    };

    createProduct = ( req: Request, res: Response ) => {
        const [ error, createProductDTO ] = CreateProductDTO.create( req.body );
        if ( error ) return res.status( 400 ).json({ error });

        this.productService.createProduct( createProductDTO! )
            .then( product => res.json( product ) )
            .catch( error => this.handleError( error, res ) );
    };

    getProducts = async( req: Request, res: Response ) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDTO ] = PaginationDTO.create( +page, +limit );
        if ( error ) return res.status( 400 ).json({ error });

        this.productService.getProducts( paginationDTO! )
            .then( products => res.json( products ) )
            .catch( error => this.handleError( error, res ) );
    };

};
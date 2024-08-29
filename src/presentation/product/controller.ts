import { Request, Response } from 'express';
import { CustomError } from '../../domain';

export class ProductController {

    constructor() {};

    private handleError = ( error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message });
        };
            
        console.log(`${ error }`);
        return res.status( 500 ).json({ error: 'Internal server error' });
    };

    createProduct = ( req: Request, res: Response ) => {
        res.json('createProduct');
    };

    getProducts = async( req: Request, res: Response ) => {
        res.json('getProducts');
    };

};
import { Request, Response } from 'express';
import { CreateProductDTO, CustomError, PaginationDTO } from '../../domain';
import { ProductService } from '../services/product.service';

export class FileUploadController {

    constructor(
        // public readonly productService: ProductService
    ) {};

    private handleError = ( error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message });
        };
            
        console.log(`${ error }`);
        return res.status( 500 ).json({ error: 'Internal server error' });
    };

    uploadFile = ( req: Request, res: Response ) => {
        res.json('uploadFile');
    };

    uploadMultiFiles = async( req: Request, res: Response ) => {
        res.json('uploadMultiFiles');
    };

};
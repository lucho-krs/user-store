import { Router } from 'express';
import { FileUploadController } from './controller';

export class FileUploadRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new FileUploadController( );
        
        router.post( '/single/:type', controller.uploadFile );
        router.post( '/multiple/:type', controller.uploadMultiFiles );

        return router;

    };

};
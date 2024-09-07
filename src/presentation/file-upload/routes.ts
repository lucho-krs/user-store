import { FileUploadService } from './../services/file-upload.service';
import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware';

export class FileUploadRoutes {

    static get routes(): Router {

        const router = Router();

        const fileUploadService = new FileUploadService();
        const controller = new FileUploadController( fileUploadService );

        router.use( FileUploadMiddleware.containFiles );
        
        router.post( '/single/:type', controller.uploadFile );
        router.post( '/multiple/:type', controller.uploadMultiFiles );

        return router;

    };

};
import { Router } from 'express';
import { ProductController } from './controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class ProductRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new ProductController();
        
        router.get( '/', controller.getProducts );
        router.post( '/', AuthMiddleware.validateJWT, controller.createProduct );

        return router;

    };

};
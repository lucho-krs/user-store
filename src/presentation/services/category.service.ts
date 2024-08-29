import { CategoryModel } from '../../data';
import { CreateCategoryDTO, CustomError, PaginationDTO, UserEntity } from './../../domain';

export class CategoryService {

    constructor() {};

    async createCategory( createCategoryDTO: CreateCategoryDTO, user: UserEntity ) {
        const existCategory = await CategoryModel.findOne({ name: createCategoryDTO.name });
        if ( existCategory ) throw CustomError.badRequest( 'Category already exist' );

        try {
            const category = new CategoryModel({
                ...createCategoryDTO,
                user: user.id
            });
            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            };
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        };
    };

    async getCategories( paginationDTO: PaginationDTO ) {
        const { page, limit } = paginationDTO;

        try {
            const [ total, categories ] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip( ( page - 1 ) * limit )
                    .limit( limit )
            ]);
            
            return {
                page,
                limit,
                total,
                next: `/api/categories?page=${( page + 1 )}&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/categories?page=${( page + 1 )}&limit=${ limit }` : null,
                categories: categories.map( category => ({
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
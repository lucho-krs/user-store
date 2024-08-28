import { CategoryModel } from '../../data';
import { CreateCategoryDTO, CustomError, UserEntity } from './../../domain';

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

};
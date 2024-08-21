import { UserModel } from '../../data';
import { CustomError, RegisterUserDTO, UserEntity, LoginUserDTO } from '../../domain/';
import { bcryptAdapter } from '../../config/bcrypt.adapter';

export class AuthService {

    constructor() {};

    public async registerUser( registerUserDTO: RegisterUserDTO ) {
        const existUser = await UserModel.findOne({ email: registerUserDTO.email });
        if ( existUser ) throw CustomError.badRequest( 'Email already exist' );

        try {
            const user = new UserModel( registerUserDTO );
            user.password = bcryptAdapter.hash( registerUserDTO.password );
            await user.save();

            const { password, ...rest } = UserEntity.fromObject( user );

            return {
                user: rest,
                token: 'tokendoomy'
            };
        } catch ( error ) {
            throw CustomError.internalServer(`${ error }`);
        };
    };

    public async loginUser( loginUserDTO: LoginUserDTO ) {
        const existUser = await UserModel.findOne({ email: loginUserDTO.email });
        if ( !existUser ) throw CustomError.notFound( 'User does not exist' );

        try {
            const isMatch = bcryptAdapter.compare( loginUserDTO.password, existUser.password );
            if ( !isMatch ) throw CustomError.badRequest( 'Password is not valid' );

            const { password, ...rest } = UserEntity.fromObject( existUser );

            return {
                user: rest,
                token: 'token'
            };
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        };
    };

};
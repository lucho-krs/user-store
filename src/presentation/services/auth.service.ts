import { UserModel } from '../../data';
import { CustomError, RegisterUserDTO, UserEntity } from '../../domain/';
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

};
import { UserModel } from '../../data';
import { CustomError, RegisterUserDTO } from '../../domain/';

export class AuthService {

    constructor() {};

    public async registerUser( registerUserDTO: RegisterUserDTO ) {
        const existUser = await UserModel.findOne({ email: registerUserDTO.email });
        if ( existUser ) throw CustomError.badRequest( 'Email already exist' );

        return 'OK!'
    };

};
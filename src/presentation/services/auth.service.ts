import { UserModel } from '../../data';
import { CustomError, RegisterUserDTO, UserEntity, LoginUserDTO } from '../../domain/';
import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { envs, JwtAdapter } from '../../config';
import { EmailService } from './email.service';

export class AuthService {

    constructor(
        private readonly emailService: EmailService
    ) {};

    public async registerUser( registerUserDTO: RegisterUserDTO ) {
        const existUser = await UserModel.findOne({ email: registerUserDTO.email });
        if ( existUser ) throw CustomError.badRequest( 'Email already exist' );

        try {
            const user = new UserModel( registerUserDTO );
            user.password = bcryptAdapter.hash( registerUserDTO.password );
            await user.save();

            await this.sendEmailValidationLink( user.email );

            const { password, ...rest } = UserEntity.fromObject( user );
            
            const token = await JwtAdapter.generateToken({ id: user.id });
            if ( !token ) throw CustomError.internalServer( 'Error while creating JWT' );

            return {
                user: rest,
                token
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

            const token = await JwtAdapter.generateToken({ id: existUser.id });
            if ( !token ) throw CustomError.internalServer( 'Error while creating JWT' );

            return {
                user: rest,
                token
            };
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        };
    };

    private sendEmailValidationLink = async( email: string ) => {
        const token = await JwtAdapter.generateToken({ email });
        if ( !token ) throw CustomError.internalServer( 'Error getting token' );

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const htmlBody = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${ link }">Validate your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody
        };

        const isSent = await this.emailService.sendEmail( options );
        if ( !isSent ) throw CustomError.internalServer( 'Error sending email' );

        return true;
    };

};
import { Request, Response } from 'express';
import { RegisterUserDTO } from '../../domain/dtos/auth/register-user.dto';
import { AuthService } from '../services/auth.service';

export class AuthController {

    constructor(
        public readonly authService: AuthService
    ) {};

    registerUser = ( req: Request, res: Response ) => {
        const [ error, registerDTO ] = RegisterUserDTO.create( req.body );
        if ( error ) return res.status( 400 ).json({ error })

        this.authService.registerUser( registerDTO! )
            .then( ( user ) => res.json( user ))
    };

    loginUser = ( req: Request, res: Response ) => {
        res.json('loginUser')
    };

    validateEmail = ( req: Request, res: Response ) => {
        res.json('validateEmail')
    };

};
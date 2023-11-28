import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';
import { LoginUserDto } from '../..';


interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}


interface LoginUserUseCase {
    execute( LoginUserDtoUserDto: LoginUserDto ): Promise<UserToken>
}

type SingToken = (payload: Object, duration?: string) => Promise<string | null>;


export class LoginUser implements LoginUserUseCase {
    
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly singToken: SingToken = JwtAdapter.generateToken,
    ){}


    async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
        
        // Crear usuario
        const user = await this.authRepository.login(loginUserDto);
        
        // Token
        const token = await this.singToken({ id: user.id }, '2h');
        if ( !token ) throw CustomError.internalServerError('Error generating token');


        return {
            token: token,
            user: {
                id:user.id,
                name: user.name,
                email: user.email,
            }

        }

    }

}
import { JwtAdapter } from '../../../config';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';


interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}


interface RegisterUserUseCase {
    execute( registerUserDto: RegisterUserDto ): Promise<UserToken>
}

type SingToken = (payload: Object, duration?: string) => Promise<string | null>;


export class RegisterUser implements RegisterUserUseCase {
    
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly singToken: SingToken = JwtAdapter.generateToken,
    ){}


    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
        
        // Crear usuario
        const user = await this.authRepository.register(registerUserDto);
        
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
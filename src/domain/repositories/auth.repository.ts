import { UserEntity } from '../entities/user.entity';
import { LoginUserDto, RegisterUserDto } from '../index';



export abstract class AuthRepository {

    abstract login( loginUserDto: LoginUserDto ): Promise<UserEntity>

    abstract register( registerUserDto: RegisterUserDto ): Promise<UserEntity>
}
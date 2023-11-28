import { BcryptAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity, } from '../../domain';
import { UserMapper } from '../mappers/user.mapper';

type HashFucnction = (password: string) => string;
type CompareFucnction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
    
    constructor(
        private readonly hashPassword: HashFucnction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFucnction = BcryptAdapter.compare
    ) {}


    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        
        const { email, password } = loginUserDto;

        try {
            
            // 1. verificar correo existente
            const user = await UserModel.findOne({ email });
            if ( !user ) throw CustomError.badRequest('User does not exist - email');
            
            // 2. Comparar las contraseñas
            const isMatching = this.comparePassword( password, user.password ) 
            if( !isMatching ) throw CustomError.badRequest('Wrong password');

            // 3. Mappear el usuario
            return UserMapper.userEntityFromObject( user );

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }


    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        
        const { name, email, password } = registerUserDto;

        try {

            // 1. verificar si el correo existe
            const emailExists = await UserModel.findOne({ email });
            if (emailExists)
                throw CustomError.badRequest('User already exists');

            // 2. Hash de la contraseña
            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password),
            });
            await user.save();

            // 3. Mapear la respuesta de nuestra entidad
            return UserMapper.userEntityFromObject( user );

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }
}

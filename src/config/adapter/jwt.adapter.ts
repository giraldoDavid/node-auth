import jwt from 'jsonwebtoken'
import { envs } from '../envs';


const JWT_SEED = envs.JWT_SEED;


export class JwtAdapter {

    static async generateToken( 
        payload: Object, 
        duration: string = '2h' ): Promise<string|null> {

        
        // todo: generación de la semilla
        return new Promise ( (resolve, reject) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, ( err, token ) => {

                if ( err ) return resolve( null );
                
                resolve(token!)

            })
        } )
        
    }

    static validateToken<T>( token: string ): Promise<T | null> {
        return new Promise (( resolve, reject ) => {
            jwt.verify( token, JWT_SEED, (err, decoded) => {
                
                if ( err ) return resolve(null);
                
                resolve(decoded as T);

            })
        })
    }

}
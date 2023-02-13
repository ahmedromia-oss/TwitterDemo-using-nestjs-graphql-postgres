import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';


@Module({
    exports:[AuthService , JwtModule],
    imports:[forwardRef(()=>UsersModule), 
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '10h' },
          }),
          
        ],
          providers:[AuthService]
    
})
export class AuthModule {}

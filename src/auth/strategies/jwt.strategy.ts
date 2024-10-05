import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategies extends PassportStrategy( Strategy ) {

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService
  ){
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }


  async validate( payload: JwtPayload ):Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id });

    if( !user ) throw new UnauthorizedException('Token not valid');
    if( !user.isActive ) throw new UnauthorizedException('User is inactive, talk to the administrator');

    return user;
  }
}
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });
    if(!user) throw new UnauthorizedException('Invalid credentials');
    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Invalid credentials');
    return user;
    //TODO: retornar jwt
  }

  private handleDBErrors( errors: any ): never{
    if(errors.code === '23505') throw new BadRequestException(errors.detail);
    console.log(errors);
    throw new InternalServerErrorException('Something went wrong');
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/context/security/roles/entities';

export class RefreshTokenRespponseDto {
  @ApiProperty({
    type: 'string',
    example: 'fnwinf0j29jdqwkmgfj34q09gm4q3gmrqgǵ.rqg4k3gff34f34g34g',
  })
  token: string;
}

export class UserResponseLoginDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: () => [Role],
  })
  roles: Role[];
}

export class LoginResponseDto {
  @ApiProperty()
  user: UserResponseLoginDto;

  @ApiProperty({
    type: 'string',
    example: 'fnwinf0j29jdqwkmgfj34q09gm4q3gmrqgǵ.rqg4k3gff34f34g34g',
  })
  token: string;

  refreshToken: string;
}

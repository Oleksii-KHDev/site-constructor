import { IsDefined, IsEmail, IsUrl } from 'class-validator';
import 'reflect-metadata';
import { Expose } from 'class-transformer';

export class HostingAccountOptionsDto {
  @IsDefined({ message: 'Email have to be defined' })
  @IsEmail({}, { message: 'Invalid email' })
  @Expose()
  email: string;

  @IsDefined({ message: 'Hosting url have to be defined' })
  @IsUrl(
    { protocols: ['http', 'https'], require_tld: true, require_protocol: true, require_host: true },
    { message: 'Invalid hosting url' },
  )
  @Expose()
  hostingUrl: string;
}

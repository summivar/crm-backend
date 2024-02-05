import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Infotracer } from '../../infotracer/entities';
import { Client } from './client.entity';

@Entity()
export class IndividualClient extends Client {
  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  middlename: string;

  @Column()
  birthday: Date;

  @ManyToOne(() => Infotracer, infotracer => infotracer.individualClients)
  @JoinColumn({name: 'infotracerId'})
  infotracer: Infotracer;
}
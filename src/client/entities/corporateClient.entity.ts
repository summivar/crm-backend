import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Infotracer } from '../../infotracer/entities';
import { Client } from './client.entity';

@Entity()
export class CorporateClient extends Client {
  @Column()
  name: string;

  @Column()
  INN: string;

  @Column()
  KPP: string;

  @Column()
  dateOfCreation: Date;

  @ManyToOne(() => Infotracer, infotracer => infotracer.corporateClients)
  @JoinColumn({ name: 'infotracerId' })
  infotracer: Infotracer;
}
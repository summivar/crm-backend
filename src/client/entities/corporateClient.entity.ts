import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InfoTracer } from '../../infoTracer/entities/infoTracer.entity';
import { Client } from './client.entity';

@Entity()
export class CorporateClient extends Client {
  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  INN: number;

  @Column({
    unique: true,
    nullable: false,
  })
  KPP: number;

  @Column({
    nullable: true,
  })
  dateOfCreation: Date;

  @ManyToOne(() => InfoTracer, infoTracer => infoTracer.corporateClients)
  @JoinColumn({name: 'infoTracerId'})
  infoTracer: InfoTracer;
}
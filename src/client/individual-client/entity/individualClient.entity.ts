import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Client } from '../../entity/client.entity';
import { InfoTracer } from '../../../infoTracer/entities/infoTracer.entity';
import { Company } from '../../../company/entities/company.entity';

@Entity()
export class IndividualClient extends Client {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  surname: string;

  @Column({
    nullable: false,
  })
  middleName: string;

  @Column({
    nullable: false,
  })
  birthday: Date;

  @ManyToOne(() => InfoTracer, infoTracer => infoTracer.individualClients)
  @JoinColumn({name: 'infoTracerId'})
  infoTracer: InfoTracer;

  @ManyToOne(() => Company, company => company.individualClients)
  @JoinColumn({name: 'companyId'})
  company: Company;
}
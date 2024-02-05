import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../company/entities';
import { IndividualClient, CorporateClient } from '../../client';

@Entity()
export class Infotracer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => IndividualClient, (individualClient) => individualClient.infotracer)
  individualClients: IndividualClient[];

  @OneToMany(() => CorporateClient, (CorporateClient) => CorporateClient.infotracer)
  corporateClients: CorporateClient[];

  @ManyToOne(() => Company, company => company.infotracers)
  @JoinColumn({name: 'companyId'})
  company: Company;
}
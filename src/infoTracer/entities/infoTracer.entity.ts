import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { IndividualClient } from '../../client/entities/individualClient.entity';
import { CorporateClient } from '../../client/entities/corporateClient.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class InfoTracer extends AbstractEntity<InfoTracer> {
  @Column({
    nullable: false
  })
  name: string;

  @OneToMany(() => IndividualClient, (individualClient) => individualClient.infoTracer)
  individualClients: IndividualClient[];

  @OneToMany(() => CorporateClient, (CorporateClient) => CorporateClient.infoTracer)
  corporateClients: CorporateClient[];

  @ManyToOne(() => Company, company => company.infoTracers)
  @JoinColumn({name: 'companyId'})
  company: Company;
}
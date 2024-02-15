import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';
import { IndividualClient } from '../../client/individual-client/entity/individualClient.entity';
import { CorporateClient } from '../../client/corporate-client/entity/corporateClient.entity';

@Entity()
export class InfoTracer extends AbstractEntity<InfoTracer> {
  @Column({
    nullable: false
  })
  name: string;

  @OneToMany(() => IndividualClient, (individualClient) => individualClient.infoTracer, { cascade: true })
  individualClients: IndividualClient[];

  @OneToMany(() => CorporateClient, (CorporateClient) => CorporateClient.infoTracer, { cascade: true })
  corporateClients: CorporateClient[];

  @ManyToOne(() => Company, company => company.infoTracers)
  @JoinColumn({name: 'companyId'})
  company: Company;
}
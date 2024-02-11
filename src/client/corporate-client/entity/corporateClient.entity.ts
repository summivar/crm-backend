import { Entity, Column, ManyToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { InfoTracer } from '../../../infoTracer/entities/infoTracer.entity';
import { Company } from '../../../company/entities/company.entity';
import { Order } from '../../../order/entities/order.entity';

@Entity()
class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'simple-array',
    nullable: false
  })
  addresses: string[];

  @OneToMany(() => Order, order => order.client)
  orders: Order[];
}

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
  INN: string;

  @Column({
    unique: true,
    nullable: false,
  })
  KPP: string;

  @Column({
    nullable: true,
  })
  dateOfCreation: Date;

  @ManyToOne(() => InfoTracer, infoTracer => infoTracer.corporateClients)
  @JoinColumn({ name: 'infoTracerId' })
  infoTracer: InfoTracer;

  @ManyToOne(() => Company, company => company.corporateClients)
  @JoinColumn({ name: 'companyId' })
  company: Company;
}

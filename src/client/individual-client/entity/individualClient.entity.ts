import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InfoTracer } from '../../../infoTracer/entities/infoTracer.entity';
import { Company } from '../../../company/entities/company.entity';
import { Order } from '../../../order/entities/order.entity';

@Entity()
export class IndividualClient {
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

  @OneToMany(() => Order, order => order.individualClient)
  orders: Order[];
}
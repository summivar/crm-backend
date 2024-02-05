import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../company/entities';
import { Order } from '../../order/entities';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, order => order.status)
  orders: Order[];

  @ManyToOne(() => Company, company => company.statuses)
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
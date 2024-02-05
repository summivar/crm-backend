import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../company/entities';
import { Order } from '../../order/entities';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Company, company => company.paymentMethods)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Order, order => order.paymentMethod)
  orders: Order[];
}
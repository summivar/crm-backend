import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../company/entities';
import { Order } from '../../order/entities';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  costPrice: number;

  @Column()
  difficulty: number;

  @Column()
  comment: string;

  @ManyToOne(() => Company, company => company.solutions)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToMany(() => Order, order => order.solutions)
  orders: Order[];
}
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities';

@Entity()
export abstract class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column('simple-array')
  addresses: string[];

  @OneToMany(() => Order, order => order.client)
  orders: Order[];
}
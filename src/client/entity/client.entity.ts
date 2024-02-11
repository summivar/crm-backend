import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity()
export abstract class Client extends BaseEntity {
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
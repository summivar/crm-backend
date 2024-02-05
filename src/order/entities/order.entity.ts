import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../../status/entities';
import { Client as ClientEnum } from '../../client/enums';
import { User } from '../../user/entities';
import { Client } from '../../client/entities/client.entity';
import { Solution } from '../../solution/entities';
import { PaymentMethod } from '../../paymentMethod/entities';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderNumber: number;

  @ManyToOne(() => Status, status => status.orders)
  @JoinColumn({name: 'statusId'})
  status: Status;

  @ManyToOne(() => User, user => user.createdOrders)
  @JoinColumn({ name: 'createdByUserId' })
  user: User;

  @Column({type: 'enum', enum: ClientEnum})
  clientType: ClientEnum;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  orderDate: Date;

  @ManyToMany(() => Solution)
  @JoinTable()
  solutions: Solution[];

  @Column()
  address: string;

  @ManyToMany(() => User)
  @JoinTable()
  stuff: User[];

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethod;

  @Column()
  price: number;

  @Column()
  comment: string;
}
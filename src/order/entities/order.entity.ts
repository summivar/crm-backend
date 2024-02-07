import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';
import { Status } from '../../status/entities/status.entity';
import { Client as ClientEnum } from '../../client/enums';
import { User } from '../../user/entities/user.entity';
import { Client } from '../../client/entities/client.entity';
import { Solution } from '../../solution/entities/solution.entity';
import { PaymentMethod } from '../../paymentMethod/entities/paymentMethod.entity';
import { Company } from '../../company/entities/company.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class Order extends AbstractEntity<Order> {
  @Column({
    nullable: false
  })
  orderNumber: number;

  @Column({
    type: 'enum',
    enum: ClientEnum,
    nullable: false
  })
  clientType: ClientEnum;

  @Column({
    nullable: false
  })
  orderDate: Date;

  @Column({
    nullable: false
  })
  address: string;

  @Column({
    nullable: false
  })
  price: number;

  @Column({
    nullable: true
  })
  comment: string;

  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  updatedAt: Date;

  @ManyToMany(() => Solution)
  @JoinTable({name: 'solutionsId'})
  solutions: Solution[];

  @ManyToMany(() => User)
  @JoinTable({name: 'usersId'})
  stuff: User[];

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({name: 'paymentMethodId'})
  paymentMethod: PaymentMethod;

  @ManyToOne(() => Client)
  @JoinColumn({name: 'clientId'})
  client: Client;

  @ManyToOne(() => Company)
  @JoinColumn({name: 'companyId'})
  company: Company;

  @ManyToOne(() => Status, status => status.orders)
  @JoinColumn({name: 'statusId'})
  status: Status;

  @ManyToOne(() => User, user => user.createdOrders)
  @JoinColumn({name: 'createdByUserId'})
  user: User;
}
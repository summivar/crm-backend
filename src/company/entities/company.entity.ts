import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn
} from 'typeorm';
import { InfoTracer } from '../../infoTracer/entities/infoTracer.entity';
import { Status } from '../../status/entities/status.entity';
import { PaymentMethod } from '../../paymentMethod/entities/paymentMethod.entity';
import { User } from '../../user/entities/user.entity';
import { Solution } from '../../solution/entities/solution.entity';
import { Order } from '../../order/entities/order.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class Company extends AbstractEntity<Company> {
  @Column({
    nullable: true
  })
  signUpManagerString: string;

  @Column({
    nullable: true
  })
  signUpCleanerString: string;

  @Column({
    nullable: true
  })
  signUpDriverString: string;

  @OneToMany(() => InfoTracer, infoTracer => infoTracer.company)
  infoTracers: InfoTracer[];

  @OneToMany(() => Status, status => status.company)
  statuses: Status[];

  @OneToMany(() => PaymentMethod, paymentMethod => paymentMethod.company)
  paymentMethods: PaymentMethod[];

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToMany(() => Solution, solution => solution.company)
  solutions: Solution[];

  @OneToMany(() => Order, order => order.company)
  orders: Order[];

  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  updatedAt: Date;
}
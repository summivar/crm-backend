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
import { CorporateClient } from '../../client/corporate-client/entity/corporateClient.entity';
import { IndividualClient } from '../../client/individual-client/entity/individualClient.entity';
import { Exclude } from 'class-transformer';

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

  @OneToMany(() => InfoTracer, infoTracer => infoTracer.company, { cascade: true })
  infoTracers: InfoTracer[];

  @OneToMany(() => Status, status => status.company, { cascade: true })
  statuses: Status[];

  @OneToMany(() => PaymentMethod, paymentMethod => paymentMethod.company, { cascade: true })
  paymentMethods: PaymentMethod[];

  @OneToMany(() => User, user => user.company, { cascade: true })
  users: User[];

  @OneToMany(() => CorporateClient, corporateClient => corporateClient.company, { cascade: true })
  corporateClients: CorporateClient[];

  @OneToMany(() => IndividualClient, individualClient => individualClient.company, { cascade: true })
  individualClients: IndividualClient[];

  @OneToMany(() => Solution, solution => solution.company, { cascade: true })
  solutions: Solution[];

  @OneToMany(() => Order, order => order.company, { cascade: true })
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
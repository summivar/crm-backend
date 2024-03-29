import {
  BeforeInsert,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany, UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Role } from '../../auth/enums';
import { Order } from '../../order/entities/order.entity';
import * as argon from 'argon2';
import { AbstractEntity } from '../../common/entity/abstract.entity';
// import { Confirm } from '../../auth/entities/confirm.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: true
  })
  surname: string;

  @Column({
    nullable: true
  })
  middleName: string;

  @Column({
    unique: true,
    nullable: false
  })
  phone: string;

  @Column({
    nullable: true
  })
  photoPath: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.DRIVER,
    nullable: false
  })
  role: Role;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    nullable: false,
    select: false,
  })
  refreshToken: string;

  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  updatedAt: Date;

  @ManyToOne(() => Company, company => company.users)
  @JoinColumn({name: 'companyId'})
  company: Company;

  @OneToMany(() => Order, order => order.user, { cascade: true })
  createdOrders: Order[];

  @ManyToMany(() => Order, order => order.stuff)
  assignedOrders: Order[];

  // @OneToMany(() => Confirm, confirm => confirm.user)
  // confirm: Confirm;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await argon.hash(this.password);
  }
}
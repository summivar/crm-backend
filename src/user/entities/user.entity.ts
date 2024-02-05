import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Company } from '../../company/entities';
import { Role } from '../../role/enums';
import { Order } from '../../order/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  middlename: string;

  @Column()
  phone: string;

  @Column()
  photoPath: string;

  @Column({type: 'enum', enum: Role, default: Role.DRIVER})
  Role: Role;

  @Column()
  passwordHash: string;

  @ManyToOne(() => Company, company => company.users)
  @JoinColumn({name: 'companyId'})
  company: Company;

  @OneToMany(() => Order, order => order.user)
  createdOrders: Order[];

  @ManyToMany(() => Order, order => order.stuff)
  assignedOrders: Order[];
}
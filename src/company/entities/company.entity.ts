import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Infotracer } from '../../infotracer/entities';
import { Status } from '../../status/entities';
import { PaymentMethod } from '../../paymentMethod/entities';
import { User } from '../../user/entities';
import { Solution } from '../../solution/entities';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Infotracer, infotracer => infotracer.company)
  infotracers: Infotracer[];

  @OneToMany(() => Status, status => status.company)
  statuses: Status[];

  @OneToMany(() => PaymentMethod, paymentMethod => paymentMethod.company)
  paymentMethods: PaymentMethod[];

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToMany(() => Solution, solution => solution.company)
  solutions: Solution[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
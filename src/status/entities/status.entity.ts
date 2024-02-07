import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Order } from '../../order/entities/order.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class Status extends AbstractEntity<Status> {
  @Column({
    nullable: false
  })
  name: string;

  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  updatedAt: Date;

  @OneToMany(() => Order, order => order.status)
  orders: Order[];

  @ManyToOne(() => Company, company => company.statuses)
  @JoinColumn({name: 'companyId'})
  company: Company;
}
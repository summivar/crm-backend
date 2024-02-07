import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Order } from '../../order/entities/order.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class Solution extends AbstractEntity<Solution>{
  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: false
  })
  price: number;

  @Column({
    nullable: false
  })
  costPrice: number;

  @Column({
    nullable: false
  })
  difficulty: number;

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

  @ManyToOne(() => Company, company => company.solutions)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToMany(() => Order, order => order.solutions)
  orders: Order[];
}
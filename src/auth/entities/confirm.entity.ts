// import { User } from '../../user/entities/user.entity';
// import { Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
// import { AbstractEntity } from '../../common/entity/abstract.entity';
//
// export class Confirm extends AbstractEntity<Confirm> {
//   @CreateDateColumn({
//     type: 'timestamp with time zone'
//   })
//   createdAt: Date;
//
//   @Column({
//     nullable: false
//   })
//   code: string;
//
//   @ManyToOne(() => User, user => user.confirm)
//   @JoinColumn({name: 'userId'})
//   user: User;
// }
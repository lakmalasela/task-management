import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from 'typeorm';

  import { User } from 'src/user/user.entity';
  import { Priority } from 'src/shared/enum/priority.enum';
  import { Category } from 'src/shared/enum/category.enum';
  import { Status } from 'src/shared/enum/status.enum';

  
  @Entity('task')
  export class Task {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    dueDate:Date;

    // @Column()
    // isCompleted: Boolean;

    @CreateDateColumn()  
    created_at: Date;
    
    @UpdateDateColumn()  
    updated_at: Date;

     @ManyToOne(() => User, { eager: true })
     @JoinColumn({ name: "userId" })
    user: User;

    @Column({
    type: "varchar",
    enum: Priority,
    })
    priority: Priority;

    @Column({
    type: "varchar",
    enum: Category,
    })
    category: Category;

    @Column({
    type: "varchar",
    enum: Status,
    })
    status: Status;
      
      
}

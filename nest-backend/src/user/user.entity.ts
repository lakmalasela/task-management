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
  import { Task } from 'src/tasks/entities/task.entity';
  
  @Entity('user')
  export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
   
    @CreateDateColumn()  
    created_at: Date;
    
    @UpdateDateColumn()  
    updated_at: Date;


    @Column({ nullable:true})
    firstName: string;

    @Column({ nullable:true})
    lastName: string;

    @Column({ nullable:true})
    address: string;

    @Column({ nullable:true})
    profileImage: string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];
  }
  
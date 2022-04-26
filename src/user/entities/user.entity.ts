import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  email: string;

  @Column({select: false})
  password: string;

  @BeforeInsert()
  async hashPassword() {
    console.log('hashing');
    this.password = await hash(this.password, 10);
  }
}

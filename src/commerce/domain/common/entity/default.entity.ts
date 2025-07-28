import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class DefaultEntity extends BaseEntity {
  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}

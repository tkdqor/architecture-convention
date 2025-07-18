import { Entity } from 'typeorm';
import AggregateRootEntity from '../../common/aggregate-root.entity';

@Entity('user')
export class User extends AggregateRootEntity {
  // TODO
}

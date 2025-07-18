import { Entity } from 'typeorm';
import { DefaultEntity } from './default.entity';

@Entity()
export class AggregateRootEntity extends DefaultEntity {
  // TO BE IMPLEMENTED
}

export default AggregateRootEntity;

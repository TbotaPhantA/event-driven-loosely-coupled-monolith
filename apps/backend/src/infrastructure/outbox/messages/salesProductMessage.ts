import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IEvent } from '../../shared/types/IEvent';

@Entity({ name: 'sales_product_messages' })
export class SalesProductMessage implements IEvent {
  @PrimaryGeneratedColumn({ name: 'message_id' })
  messageId!: number;

  @Column()
  name!: string;

  @Column({ name: 'aggregate_id' })
  aggregateId!: string;

  @Column({ type: 'jsonb' })
  data!: object;
}

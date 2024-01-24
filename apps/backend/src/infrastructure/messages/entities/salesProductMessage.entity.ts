import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MessageTypeEnum } from '../../shared/enums/messageType.enum';
import { NoMethods } from '../../shared/types/noMethods';
import { SalesProductCreatedData } from '../../../sales/domain/salesProduct/events/salesProductCreated';

@Entity({ name: 'sales_product_outbox_messages' })
export class SalesProductMessage {
  @PrimaryGeneratedColumn({ name: 'message_id' })
  messageId!: number;

  @Column({ name: 'message_type', enum: MessageTypeEnum })
  messageType!: MessageTypeEnum;

  @Column({ name: 'message_name' })
  messageName!: string;

  @Column({ name: 'correlation_id' })
  correlationId!: string;

  @Column({ name: 'producer_name' })
  producerName!: string;

  @Column({ name: 'aggregate_id' })
  aggregateId!: string;

  @Column({ type: 'jsonb' })
  data!: SalesProductCreatedData;

  static createByRaw(raw: NoMethods<SalesProductMessage>): SalesProductMessage {
    const message = new SalesProductMessage();

    message.messageId = raw.messageId;
    message.messageType = raw.messageType;
    message.messageName = raw.messageName;
    message.correlationId = raw.correlationId;
    message.producerName = raw.producerName;
    message.aggregateId = raw.aggregateId;
    message.data = raw.data;

    return message;
  }
}

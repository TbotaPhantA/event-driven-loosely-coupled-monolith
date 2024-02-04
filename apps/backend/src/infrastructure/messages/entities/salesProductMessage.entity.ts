import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MessageTypeEnum } from '../../shared/enums/messageType.enum';
import { NoMethods } from '../../shared/types/noMethods';

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

  @Column({ name: 'aggregate_id' })
  aggregateId!: string;

  @Column({ name: 'aggregate_name' })
  aggregateName!: string;

  @Column({ name: 'context_name' })
  contextName!: string;

  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  static createByRaw(raw: NoMethods<SalesProductMessage>): SalesProductMessage {
    const message = new SalesProductMessage();

    message.messageId = raw.messageId;
    message.messageType = raw.messageType;
    message.messageName = raw.messageName;
    message.correlationId = raw.correlationId;
    message.aggregateId = raw.aggregateId;
    message.aggregateName = raw.aggregateName;
    message.contextName = raw.contextName;
    message.data = raw.data;

    return message;
  }
}

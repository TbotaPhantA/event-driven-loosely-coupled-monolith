import { Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../shared/types/noMethods';

@Entity({ name: 'sales_product_idemp_messages' })
export class SalesProductIdempMessageEntity {
  @PrimaryColumn({ name: 'message_id' })
  messageId!: string;

  static createByRaw(raw: NoMethods<SalesProductIdempMessageEntity>): SalesProductIdempMessageEntity {
    const message = new SalesProductIdempMessageEntity();
    message.messageId = raw.messageId;
    return message;
  }
}

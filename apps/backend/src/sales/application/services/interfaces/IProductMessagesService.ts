import { IEvent } from '../../../domain/product/events/IEvent';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';

export interface IProductMessagesService {
  insertEvent(event: IEvent, producerName: string, transaction: ITransaction): Promise<void>;
}

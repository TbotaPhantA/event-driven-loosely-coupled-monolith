import { IEvent } from '../../../domain/salesProduct/events/IEvent';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';

export interface ISalesProductMessagesService {
  insertEvent(event: IEvent, producerName: string, transaction: ITransaction): Promise<void>;
}

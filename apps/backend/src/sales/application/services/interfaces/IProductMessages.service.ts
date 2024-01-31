import { IEvent } from '../../../domain/product/events/IEvent';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';

export interface IProductMessagesService {
  insertEvent(event: IEvent, transaction: ITransaction): Promise<void>;
}

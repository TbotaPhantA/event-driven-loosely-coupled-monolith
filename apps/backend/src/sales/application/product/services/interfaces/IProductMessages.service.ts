import { IProductEvent } from '../../../../domain/product/events/IProductEvent';
import { ITransaction } from '../../../../../infrastructure/transaction/shared/types/ITransaction';
import { IProductBaseEvent } from '../../../../domain/product/events/IProductBaseEvent';

export interface IProductMessagesService {
  insertEvents(event: (IProductEvent | IProductBaseEvent)[], transaction: ITransaction): Promise<void>;
}

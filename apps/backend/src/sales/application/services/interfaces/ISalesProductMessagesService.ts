import { IEvent } from '../../../domain/salesProduct/events/IEvent';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductCreatedData } from '../../../domain/salesProduct/events/salesProductCreated';

export interface ISalesProductMessagesService {
  insertEvent(event: IEvent<SalesProductCreatedData>, producerName: string, transaction: ITransaction): Promise<void>;
}

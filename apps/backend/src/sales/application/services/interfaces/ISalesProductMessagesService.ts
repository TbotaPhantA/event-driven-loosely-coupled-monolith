import { IEvent } from '../../../domain/salesProduct/events/IEvent';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductOutputDto } from '../../dto/output/salesProductOutputDto';

export interface ISalesProductMessagesService {
  insertEvent(event: IEvent<SalesProductOutputDto>, producerName: string, transaction: ITransaction): Promise<void>;
}

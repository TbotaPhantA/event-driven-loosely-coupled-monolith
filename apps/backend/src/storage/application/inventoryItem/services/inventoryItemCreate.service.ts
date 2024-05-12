import { Inject, Injectable } from '@nestjs/common';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { CreateInventoryItemDto } from '../dto/input/createInventoryItem.dto';
import { TRANSACTION_SERVICE } from '../../../../infrastructure/transaction/shared/constants';
import { ITransactionService } from '../../../../infrastructure/transaction/ITransaction.service';
import { InventoryItem } from '../../../domain/inventoryItem/inventoryItem';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { InventoryItemRepository } from '../../../dal/inventoryItem.repository';
import { CreateInventoryItemOutputDto } from '../dto/output/createInventoryItemOutput.dto';
import { INVENTORY_ITEM_REPOSITORY } from '../../shared/constants';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class InventoryItemCreateService {
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repo: InventoryItemRepository,
    private readonly time: TimeService,
  ) {}

  async runTransaction(dto: CreateInventoryItemDto): Promise<CreateInventoryItemOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', manager => {
      return this.create(dto, manager);
    })
  }

  async create(
    dto: CreateInventoryItemDto,
    transaction: ITransaction,
  ): Promise<CreateInventoryItemOutputDto> {
    const inventoryItem = InventoryItem.create(dto, { time: this.time });
    const insertedItem = await this.repo.insert(inventoryItem, transaction);
    this.server.emit('InventoryItemCreated', {
      insertedItem: insertedItem.export(),
    });
    return CreateInventoryItemOutputDto.from(insertedItem);
  }
}

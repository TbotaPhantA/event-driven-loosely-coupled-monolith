import { InventoryItemController } from '../../../src/storage/application/inventoryItem/inventoryItem.controller';
import { Socket, io } from 'socket.io-client'
import {
  CreateSalesProductEventPayloadBuilder
} from '../../shared/__fixtures__/builders/createSalesProductEventPayload.builder';
import { InventoryItem } from '../../../src/storage/domain/inventoryItem/inventoryItem';
import { config } from '../../../src/infrastructure/config/config';
import { SALES_CONTEXT_NAME } from '../../../src/sales/application/shared/constants';
import { MessageTypeEnum } from '../../../src/infrastructure/shared/enums/messageType.enum';
import { MessageNamesEnum } from '../../../src/storage/application/shared/enums/messageNames.enum';
import { producer } from '../globalBeforeAndAfterAll';
import { Product } from '../../../src/sales/domain/product/product';
import { sleep } from '../../../src/infrastructure/shared/utils/sleep';
import {
  CreateSalesProductEventPayloadChangesBuilder
} from '../../shared/__fixtures__/builders/createSalesProductEventPayloadChanges.builder';

describe.skip(`${InventoryItemController}`, () => {
  let socket: Socket<any>;

  beforeAll(async () => {
    socket = io(`${config.app.origin}`);
  }, 30000);

  afterAll(async () => {
    socket.disconnect();
  }, 30000);

  describe(`${InventoryItemController.prototype.getAllInventoryItems.name}`, () => {
    test(
      'when proper message is received - should respond add new inventory item to the list via websocket',
      async () => {
        // 1. подготовка данных
        const productId = 'test1';
        const event = CreateSalesProductEventPayloadBuilder.defaultAll.with({
          productId,
          changes: CreateSalesProductEventPayloadChangesBuilder.defaultAll.with({
            productId,
          }).result,
        }).result;
        let newItem;
        // 2. подписка на сообщение по веб сокету
        socket.on('InventoryItemCreated', (data: { insertedItem: ReturnType<InventoryItem['export']> }) => {
          if (data.insertedItem.inventoryItemId === event.productId) {
            newItem = data.insertedItem;
          }
        });
        // 3. отпрвка сообщения в брокер kafka
        await producer.send({
          topic: config.kafka.kafkaProductsTopic,
          messages: [
            {
              key: event.productId,
              headers: {
                messageId: 'messageId',
                messageType: MessageTypeEnum.event,
                messageName: MessageNamesEnum.ProductCreated,
                correlationId: '01HXQDP69QRHTTMYTHQQ7SX3NE',
                aggregateName: Product.name,
                contextName: SALES_CONTEXT_NAME,
              },
              value: JSON.stringify({ payload: JSON.stringify(event) }),
            }
          ],
        });
        // 4. ожидание уведомления с корректными данными
        while (!newItem) {
          await sleep(500);
        }
      }
    , 15000)
  })
});

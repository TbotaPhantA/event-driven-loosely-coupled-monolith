import { InventoryItemController } from '../../../src/storage/application/inventoryItem/inventoryItem.controller';
import { Socket } from 'socket.io-client'
import {
  CreateSalesProductEventPayloadBuilder
} from '../../shared/__fixtures__/builders/createSalesProductEventPayload.builder';
import { InventoryItem } from '../../../src/storage/domain/inventoryItem/inventoryItem';
import { config } from '../../../src/infrastructure/config/config';
import { SALES_CONTEXT_NAME } from '../../../src/sales/application/shared/constants';
import { MessageTypeEnum } from '../../../src/infrastructure/shared/enums/messageType.enum';
import { MessageNamesEnum } from '../../../src/storage/application/shared/enums/messageNames.enum';
import { Product } from '../../../src/sales/domain/product/product';
import { sleep } from '../../../src/infrastructure/shared/utils/sleep';
import {
  CreateSalesProductEventPayloadChangesBuilder
} from '../../shared/__fixtures__/builders/createSalesProductEventPayloadChanges.builder';
import { SetupManager } from '../../shared/utils/setupManager';
import { SETUP_TIMEOUT } from '../../shared/constants';
import { Producer } from 'kafkajs';
import { ulid } from 'ulid';
import { FixtureHelper } from '../../shared/utils/fixtureHelper';

function getRandomPort(min: number = 3000, max: number = 65535): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

describe(`${InventoryItemController.name}`, () => {
  let setupManager: SetupManager;
  let socket: Socket<any>;
  let producer: Producer;
  let fixtureHelper: FixtureHelper;
  let port: number;
  let inventoryItemIds: string[];
  let messageIds: string[];

  beforeAll(async () => {
    port = getRandomPort();
    setupManager = await SetupManager.beginInitStorageModule();
    producer = setupManager.initProducer();
    fixtureHelper = setupManager.initFixtureHelper();
    await setupManager.setupStorage(port);
    const origin = await setupManager.app.getUrl();
    socket = setupManager.initSocket(origin);
    inventoryItemIds = [];
    messageIds = [];
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    await Promise.all([
      fixtureHelper.cleanupInventoryItemInDB(inventoryItemIds),
      fixtureHelper.cleanupIdempMessageInDB(messageIds),
    ])
    await setupManager.teardown();
  }, SETUP_TIMEOUT);

  describe(`${InventoryItemController.prototype.getAllInventoryItems.name}`, () => {
    // TODO: refactor test
    test(
      'when proper message is received - should respond add new inventory item to the list via websocket',
      async () => {
        // 1. подготовка данных
        const productId = ulid();
        inventoryItemIds.push(productId)
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
        const messageId = ulid();
        messageIds.push(messageId);
        await producer.send({
          topic: config.kafka.kafkaProductsTopic,
          messages: [
            {
              key: event.productId,
              headers: {
                messageId,
                messageType: MessageTypeEnum.event,
                messageName: MessageNamesEnum.ProductCreated,
                correlationId: ulid(),
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
    , 30000)
  })
});

import { loadEnvironment } from './utils/loadEnvironment';
loadEnvironment();
import { config } from '../src/infrastructure/config/config';
import axios from 'axios';
import { inspect } from 'util';


(async (): Promise<void> => {
  try {
    const body = createBody();
    const { protocol, host, port } = config.debezium;
    const url = `${protocol}://${host}:${port}/connectors/`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const response = await axios.post(url, body, { headers });

    console.log(inspect({ response }, { depth: 15 }));
  } catch (e) {
    console.error('Error creating connector:', e);
  }

  function createBody(): object {
    const { database, username, password, host, port } = config.database;

    const headerMappings = [
      'message_id:header:messageId',
      'message_type:header:messageType',
      'message_name:header:messageName',
      'correlation_id:header:correlationId',
      'aggregate_name:header:aggregateName',
      'context_name:header:contextName',
    ].join(',');

    return {
      "name": "sales-product-outbox-connector",
      "config": {
        "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
        "plugin.name": "pgoutput",
        "tasks.max": "1",
        "database.hostname": host,
        "database.server.name": host,
        "database.port": port,
        "database.user": username,
        "database.password": password,
        "database.dbname": database,
        "topic.prefix": "prefix",
        "table.include.list": "public.sales_product_outbox_messages",
        "tombstones.on.delete" : "false",
        "transforms" : "outbox",
        "transforms.outbox.type" : "io.debezium.transforms.outbox.EventRouter",
        "transforms.outbox.route.topic.replacement" : config.kafka.kafkaProductsTopic,
        "transforms.outbox.table.field.event.key": "aggregate_id",
        "transforms.outbox.table.field.event.type": "message_name",
        "transforms.outbox.table.field.event.id": "message_id",
        "transforms.outbox.table.field.event.payload": "data",
        "transforms.outbox.route.by.field": "context_name",
        "transforms.outbox.table.fields.additional.placement" : headerMappings,
      },
    };
  }
})()

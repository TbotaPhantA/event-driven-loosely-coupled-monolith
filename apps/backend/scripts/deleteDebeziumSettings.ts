import { loadEnvironment } from './utils/loadEnvironment';
loadEnvironment();
import { config } from '../src/infrastructure/config/config';
import axios from 'axios';
import { inspect } from 'util';

(async (): Promise<void> => {
  try {
    const { protocol, host, port } = config.debezium;
    const url = `${protocol}://${host}:${port}/connectors/sales-product-outbox-connector`;
    const response = await axios.delete(url);
    console.log(inspect({ response }, { depth: 15 }));
  } catch (e) {
    console.error('Error deleting connector:', e);
  }
})()

import { Message } from './extractMessage';
import { KafkaContext } from '@nestjs/microservices';

export const getMessageByContext = (context: KafkaContext): Message => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return context.getMessage() as Message;
}

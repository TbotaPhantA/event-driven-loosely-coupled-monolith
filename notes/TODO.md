# Tasks TODO

Before you implement the feature, you should write a failing acceptance test.
## sales context
- [ ] add correlationId to header
- [X] move validation pipe from main to controller
- [ ] add idempotency for `CreateSalesProduct` command using `correlationId`( Google how to make idempotent endpoint)
### infrastructure
- [ ] add request logging
- [ ] add tracing
### docker-compose
- [ ] configure kafka in docker-compose
- [ ] create single `beforeAll` and `afterAll` for multiple files (or try to launch app into docker-compose)
### kafka
- [ ] implement sending `SalesProductCreated` to kafka with acceptance service test + outbox + possibly debezium
- [ ] send PriceAdjusted event to kafka
- [ ] send SalesProductInfoUpdated event to kafka
- [ ] send SalesProductRemoved event to kafka

## storage context 
- [ ] add mechanism for read, retry, and error topics


# other
## kafka message
example:
```json
{
  "header": {
    "messageId": 1,
    "messageType": "event",
    "messageName": "SalesProductCreated",
    "correlationId": "01HJ4SD9SKBHA2HZEG9RM7E2WH",
    "producerName": "Sales"
  },
  "key": {
    "aggregateId": "01HJ4SDVVFQTKB7YA8HNS26P8Q"
  },
  "value": {
    "productId": "01HJ4SDVVFQTKB7YA8HNS26P8Q",
    "name": "OnePlus 9 Pro",
    "description": "An android phone",
    "price": "500",
    "createdAt": "2023-12-20T23:39:37.778Z",
    "updatedAt": "2023-12-20T23:39:37.778Z",
    "removedAt": null 
  }
}
```

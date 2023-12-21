- add request logging
- add trace/correlationId logic
- add idempotency for `CreateSalesProduct` command
- implement sending `SalesProductCreated` to kafka with acceptance service test
- move validation pipe from main to controller
- create single `beforeAll` and `afterAll` for multiple files


kafka message:
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

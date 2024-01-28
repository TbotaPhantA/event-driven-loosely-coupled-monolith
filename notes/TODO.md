# Tasks TODO

Before you implement the feature, you should write a failing acceptance test.
## sales context
- [ ] figure out how to refactor acceptance test to make them much more readable, fast and reliable
- [ ] add `HOST` to `config` and rename `path` to `href` for api hypermedia
- [ ] send kafka message as `avro` scheme instead of `JSON` for performance reasons
- [ ] think how to remove excess `Sales` prefix in the `Sales` bounded context.
### infrastructure
- [ ] add request logging
### docker-compose
- [ ] configure schema registry for `avro` in docker-compose
### kafka
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
    "schema": {},
    "payload": { "aggregateId": "01HJ4SDVVFQTKB7YA8HNS26P8Q" }
  },
  "value": {
    "schema": {},
    "payload": {
        "product": {
          "productId": "01HJ4SDVVFQTKB7YA8HNS26P8Q",
          "name": "OnePlus 9 Pro",
          "description": "An android phone",
          "price": "500",
          "createdAt": "2023-12-20T23:39:37.778Z",
          "updatedAt": "2023-12-20T23:39:37.778Z",
          "removedAt": null
        }
      }
  }
}
```

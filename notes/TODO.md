# Tasks TODO

Before you implement the feature, you should write a failing acceptance test.
## sales context
- [ ] manage uncommitted events inside product object
- [ ] replace `productName` with `aggregateName` and `contextName`
- [ ] Add `HOST` to `config` and rename `path` to `href` for api hypermedia
- [ ] Send kafka message as `avro` scheme instead of `JSON` for performance reasons
- [ ] integrate allure with acceptance tests
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
    "messageName": "ProductCreated",
    "correlationId": "01HJ4SD9SKBHA2HZEG9RM7E2WH",
    "aggregateName": "Product",
    "contextName": "Sales"
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

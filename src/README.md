## Creating Items

```curl=
curl -X POST "http://localhost:3000/item/create" \
     -H "Content-Type: application/json" \
     -d '{
           "id": "129f47c0-e014-4488-9d54-1462130e1f9f",
           "name": "Sample Item",
           "price": 100000,
           "store_id": "de1967a1-7efe-4e34-9d68-1099f5b3ccd0",
           "image_url": "https://example.com/sample-item.jpg",
           "stock": 10
         }'
```
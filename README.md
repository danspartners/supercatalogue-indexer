# Super Catalogue - indexer

# Run the script

## Step 1. Run an ElasticSearch dev container
Use the provided Docker compose file 

```
docker compose up
```

For production, change the provided docker-compose.prod.yml to reflect requirements and then run

```
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

Alternatively, run it manually

```bash
docker run \
	-d \
	-it \
	--name supercatalogue_es_dev \
	-m 4g \
	-e "discovery.type=single-node" \
	-e "xpack.security.enabled=false" \
	-p 9200:9200 \
	-p 9300:9300 \
	docker.elastic.co/elasticsearch/elasticsearch:8.12.2 
```

## Step 2. Install deps
```
$ npm i
```

## Step 3. Run the index script
Fetches data from DataCite and injects into the ES container
```
$ npm start
```

## Step 4. Check the index
Check if the index is created and if the doc count is correct
```
$ curl localhost:9200/_cat/indices?v
```

Check search results
```
$ curl curl localhost:9200/dans-datacite/_search | jq .
```

## Step 5. Run the re-index script
Re-index with a query to create seperate indeces per DataStation
and subject
```
$ npm run reindex
```

## Step 6. Repeat step 4.

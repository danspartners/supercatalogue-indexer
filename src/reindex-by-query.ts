import { mappings } from "./mappings";
import { esClient, initIndex } from "./client";

async function reindexByClient(client: string, destination: string) {
	await initIndex(destination, mappings)
	await esClient.reindex({
		source: {
			index: 'dans-datacite',
			query: {
				match: {
					"relationships.client.data.id.keyword": client
				}
			}
		},
		dest: {
			index: destination,
		}
	})
}	

async function reindexBySubject(subject: string, destination: string) {
	await initIndex(destination, mappings)
	await esClient.reindex({
		source: {
			index: 'dans-datacite',
			query: {
				match: {
					"attributes.subjects.subject": subject
				}
			}
		},
		dest: {
			index: destination,
		}
	})
}	

async function run() {
	await reindexByClient('dans.dataversenl', 'dans-datacite-dataversenl')
	console.log('Reindexed dataversenl')
	await reindexByClient('delft.data4tu', 'dans-datacite-data4tu')
	console.log('Reindexed data4tu')
	await reindexByClient('dans.archive', 'dans-datacite-archive')
	console.log('Reindexed archive')
	await reindexBySubject('archaeology', 'dans-datacite-archaeology')
	console.log('Reindexed archaeology')
}

run()

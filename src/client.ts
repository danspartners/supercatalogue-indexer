import * as es8 from 'es8'
import { MappingTypeMapping } from 'es8/lib/api/types'

/**
 * Creates an index if it doesn't exist yet
 */
export async function initIndex(index: string, mappings?: MappingTypeMapping ) {
	try {
		const indexExists = await esClient.indices.exists({ index })
		if (indexExists) {
			await esClient.indices.delete({ index })
		}
	} catch (err) {
		console.log('[ERROR] initIndex', err)
	}

	try {
		await esClient.indices.create({
			index,
			body: { mappings }
		})
		console.log(`Index "${index}" initialised`)
	} catch (err) {
		console.log('[ERROR] initIndex', err)
	}
}

let esClient = new es8.Client({
	node: 'http://localhost:9200',
})

export { esClient }

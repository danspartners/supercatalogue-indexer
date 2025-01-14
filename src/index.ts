import { esClient, initIndex } from './client'
import { mappings } from './mappings'

const dataCiteIndex = 'dans-datacite'

const dataCiteClientIDs = ['dans.dataversenl', 'dans.archive', 'delft.data4tu']
const dataCiteBaseURL = 'https://api.datacite.org/dois?client-id='
const pagesPerClient = 100

export async function indexDataCite() {
	await initIndex(dataCiteIndex, mappings)

	for (const clientID of dataCiteClientIDs) {
		let url = dataCiteBaseURL + clientID

		let page = 0

		while (page < pagesPerClient && url != null) {
			let json: any 
			try {
				const result = await fetch(url)
				json = await result.json()
			} catch (error) {
				console.log('[ERROR] fetch', error)
			}
			console.log('Fetched', url)

			url = json.links.next

			// Add item to index
			for (const item of json.data) {
				for (const x of item.attributes.dates) {
					if (x.date.length === 4) x.date = `${x.dates}-01-01`
					if (x.date.length !== 10) x.date = null
				}

				// Add geo points
				// item.location_dev = generateRandomGeoPoint()
				item.location = getGeoPoint(item)

				item.publicationYear = item.attributes.publicationYear
				item.prefix = item.id.split('/')[0]

				try {
					await esClient.index({
						index: dataCiteIndex,
						body: item,
						id: item.id
					})
					console.log('Indexed', item.id, 'from client', clientID)
				} catch (err) {
					console.log('[ERROR] indexDocument', err)
				}
			}

			page++
		}
	}
}

function getGeoPoint(item: any) {
	if (!Array.isArray(item.attributes.geoLocations)) return null

	const geoLocation = item.attributes.geoLocations
		.find((x: any) => (
			x.geoLocationPoint?.pointLatitude != null &&
			x.geoLocationPoint?.pointLongitude != null
		))

	if (geoLocation == null) return null

	return {
		lat: geoLocation.geoLocationPoint.pointLatitude,
		lon: geoLocation.geoLocationPoint.pointLongitude
	}
}

// function generateRandomGeoPoint() {
// 	const lat = (Math.random() * 180 - 90).toFixed(2)
// 	const lon = (Math.random() * 360 - 180).toFixed(2)
// 	return {
// 		lat,
// 		lon
// 	}
// }

indexDataCite()
import { MappingTypeMapping } from 'es8/lib/api/types'

export const mappings: MappingTypeMapping = {
    properties: {
        location: {
            type: 'geo_point',
        },
        // location_dev: {
        //     type: 'geo_point',
        // },
        publicationYear: {
            type: 'integer',
        },
		  prefix: {
				type: 'keyword',
		  },
    }
}
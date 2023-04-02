import ytsr, { getFilters } from 'ytsr';


export const ytsearch = async (query) => {
    const filters = await getFilters(query);
    const filter = filters.get('Type').get('Video');
    const searchResults = await ytsr(filter.url, {limit: 1});

    return searchResults.items[0].url;
}

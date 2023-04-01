import ytsr from 'ytsr';


export const ytsearch = async (query) => {
    const filters = await ytsr.getFilters(query);
    const filter = filters.get('Type').get('Video');
    const searchResults = await ytsr(filter.url, {limit: 1});

    return searchResults.items[0].url;
}
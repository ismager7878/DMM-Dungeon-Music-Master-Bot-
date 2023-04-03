import ytsr  from 'ytsr';



export const ytsearch = async (query, message) => {
    const filters = await ytsr.getFilters(query);
    const filter = filters.get('Type').get('Video');
    const searchResults = await ytsr(filter.url, {limit: 1});
    if(searchResults.items == 0){
        message.editReply(`No results found for ${query}`);
        return;
    };
    return searchResults.items[0].url;
}

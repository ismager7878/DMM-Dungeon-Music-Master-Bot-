import ytsr  from 'ytsr';

export const ytsearch = async (query, message) => {
    const filters = await ytsr.getFilters(query).then((filters) => filters).catch((err) => {
        message.editReply(`No results found for ${query}`)
        return null;
    });
    const filter = filters?.get('Type').get('Video');
    const searchResults = await ytsr(filter?.url, {limit: 1}).then((searchResults) => searchResults).catch((err) => {
        message.editReply(`No results found for ${query}`)
        return null;
    });;
    if(searchResults?.items == 0){
        message.editReply(`No results found for ${query}`);
        return;
    };
    return searchResults.items[0].url;
}

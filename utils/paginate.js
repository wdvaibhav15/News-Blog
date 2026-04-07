const paginate = async (model ,query={}, reqQuery = {},options={}) => {
const {page =1, limit=2, sort = '-createdAt'} = reqQuery;

const  paginateOptions = {
    page : parseInt(page,10) || 1,
    limit : parseInt(limit,10) || 2,
    sort,
    ...options
}
try {    
    const result = await model.paginate(query, paginateOptions);
    return{
            data: result.docs,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasNextPage: result.hasNextPage ? result.nextPage : null,
            hasPrevPage: result.hasPrevPage ? result.prevPage : null,
            currentPage: result.page,
            counter: result.pagingCounter,
            limit: result.limit,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
        }
    }
 catch (error) {
    console.log("paginate error:", error);
    res.status(500).send("Server Error");
 }
}

module.exports = paginate;

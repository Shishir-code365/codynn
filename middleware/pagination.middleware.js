const paginationMiddleware = ()=>{
    return (req, res, next) => {
        const pageSize = parseInt(req.query.limit); 
        const pageNumber = parseInt(req.query.page) || 1; 
        const startIndex = (pageNumber - 1) * pageSize;

        req.pagination = {
            page: pageNumber,
            limit: pageSize,
            startIndex
        };

        next(); 
    };
}
    


module.exports = paginationMiddleware;

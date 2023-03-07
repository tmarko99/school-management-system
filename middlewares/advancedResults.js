const advancedResults = (model, populate, select) => {
    return async (req, res, next) => {
        let query = model.find();
        const currentPage = req.query.page || 1;
        const perPage = 2;
    
        const total = await model.countDocuments();
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = currentPage * perPage;

        if (populate) {
            query = query.populate(populate);
        }
    
        if (req.query.name) {
            query.find({
                name: { $regex: req.query.name, $options: 'i' }
            });
        }
    
        const pagination = {};
    
        if (endIndex < total) {
            pagination.next = {
                currentPage: currentPage + 1,
                perPage
            }
        }
    
        if (startIndex > 0) {
            pagination.prev = {
                currentPage: currentPage - 1,
                perPage
            }
        }

        let results;

        if (select) {
            results = await query.find().select(select)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        } else {
            results = await query.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        }
    
        res.results = {
            status: 'Success',
            data: results,
            total,
            pagination
        };

        next();
    }
};

module.exports = advancedResults;
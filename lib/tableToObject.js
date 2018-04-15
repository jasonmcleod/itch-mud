module.exports = function(model, callback) {
    const obj = {};
    model.findAll().then((records) => {
        records.forEach((r) => {
            obj[r.dataValues.id] = r.dataValues;
        });
        callback(obj);
    });
}
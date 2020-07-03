var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VillageSchema = new Schema(
    {
        village_name: {type: String, required: true, maxLength: 100},
        village_admin_key: {type: String, required: true, maxlength: 30},
        village_user_key: {type: String, required: false, maxlength: 30}
    }
);

VillageSchema.virtual('url')
    .get(function() {
        return '/villageBoard/village/' + this._id;
    });

module.exports = mongoose.model('Village', VillageSchema);
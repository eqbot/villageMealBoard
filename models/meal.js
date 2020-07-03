var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MealSchema = new Schema(
    {
        village: {type: Schema.Types.ObjectId, ref: 'Village', required:true},
        maker: {type: String, required: false, maxlength: 50},
        meal_date: {type: Date}
    }
);

MealSchema.virtual('url')
    .get(function() {
        return '/villageBoard/meal/' + this._id;
    });

module.exports = mongoose.model('Meal', MealSchema);
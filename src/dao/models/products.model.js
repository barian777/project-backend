import mongoose from 'mongoose';
import mongoosePag from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true , index:true},
    category: {type: String, enum: ['custom', 'special', 'standard'], default: 'standard'},
    thumbnail: { type: String, required: false }
});

schema.plugin(mongoosePag)

const model = mongoose.model(collection, schema);

export default model;
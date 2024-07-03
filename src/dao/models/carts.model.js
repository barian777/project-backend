import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    _user_id: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    products: {type:[{_id:mongoose.Schema.Types.ObjectId, quantity: Number }], ref: 'products', default:[]}
})

const model = mongoose.model(collection, schema)

export default model;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderListSchema = new Schema({
    email: { type: String, default: ""},
    sent: { type: Boolean, default: false}
});

const OrderListClass = mongoose.model('orderList', orderListSchema);

module.exports = OrderListClass;

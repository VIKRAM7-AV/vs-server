import mongoose from 'mongoose';

const inbound= new mongoose.Schema({
    materialId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    values:{
        type: [Number],
        default: [],
    },
    date:{
        type: [Date],
        default: [],
    }
});
const outbound= new mongoose.Schema({
    materialId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    values:{
        type: [Number],
        default: [],
    },
    location:{
        type: [String],
        required: true
    },
    date:{
        type: [Date],
        default: [],
    }
});

const newStocksSchema = new mongoose.Schema({
    siteId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    inbound:{
        type: [inbound],
        default: [],
    },
    outbound:{
        type: [outbound],
        default: [],
    }
},{timestamps: true});

const NewStocks = mongoose.model('NewStocks', newStocksSchema);
export default NewStocks;
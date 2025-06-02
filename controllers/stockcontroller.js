import Project from "../Models/projectModel.js";
import Product from "../Models/productModel.js";
import StackData from "../Models/stockModel.js";

export const stockEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const { values } = req.body;
        if (!values) {
            return res.status(400).json({ message: "Stock entry is required" });
        }
        const projectId = req.project;
        const project = await Project.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (project) {
            const stackData = await StackData.findOne({ siteId: projectId });
            if (!stackData) {
                const newStackData = new StackData({
                    siteId: projectId,
                    type: [{ materialId: product._id, values, date: [new Date()] }],
                });
                await newStackData.save();
                return res.status(201).json({ message: "Stock entry created successfully", newStackData });
            } else {
                const existingEntry = stackData.type.find(entry => entry.materialId.toString() === product._id.toString());
                if (existingEntry) {
                    existingEntry.values.push(values);
                    existingEntry.date.push(new Date());
                } else {
                    stackData.type.push({ materialId: product._id, values, date: [new Date()] });
                }
                await stackData.save();
            }
        }

        res.status(200).json({ message: "Stock entry updated successfully" });

    } catch (error) {
        console.log("Error in stockEntry controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProductStack = async (req, res, next) => {
    try {
        const projectId = req.project;
        const stackData = await StackData.findOne({ siteId: projectId._id }).populate();

        if (!stackData) {
            return res.status(404).json({ message: "No stock data found for this project" });
        }
        res.status(200).json({ message: "Stock data retrieved successfully", stackData });

    } catch (error) {
        console.log("Error in getProductStack controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProductSite = async (req, res) => {
    try {
        const projectId = req.params.id;
        const existingProject = await Project.findById({ _id: projectId });
        if (!existingProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        const stackData = await StackData.findOne({ siteId: projectId }).populate();
        if (!stackData) {
            return res.status(404).json({ message: "No stock data found for this project" });
        }
        res.status(200).json({ message: "Stock data retrieved successfully", stackData });
    } catch (error) {
        console.log("Error in getProductStack controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const AllProduct = async (req, res) => {
    try {
        const allStock = await StackData.find({}).populate({
    path: 'type.materialId',
    populate: { path: 'category' }
  });
        if (!allStock || allStock.length === 0) {
            return res.status(404).json({ message: "No stock data found" });
        }
        res.status(200).json({ message: "Stock data retrieved successfully", allStock });
    } catch (error) {
        console.log("Error in getProductStack controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const lastentry = async (req, res) => {
    try {
        const projectId = req.project;
        const stackData = await StackData.findOne({ siteId: projectId._id }).populate('type.materialId');

        if (!stackData) {
            return res.status(404).json({ message: "No stock data found for this project" });
        }
        if (stackData.type.length === 0) {
            return res.status(404).json({ message: "No stock entries found" });
        }

        const lastEntry = stackData.type.map(entry => ({
            materialId: entry.materialId.productName,
            lastValue: entry.values[entry.values.length - 1],
            lastDate: entry.date[entry.date.length - 1]
        }));
        res.status(200).json({ message: "Last stock entry retrieved successfully", lastEntry });

    } catch (error) {
        console.log("Error in lastentry controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const stockproducts = async (req, res) => {
    try {
        const projectId = req.params.id;
        const existingProject = await Project.findById({ _id: projectId });
        if (!existingProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        const stackData = await StackData.findOne({ siteId: projectId }).populate("type.materialId");
        if (!stackData) {
            return res.status(404).json({ message: "No stock data found for this project" });
        }
        if (stackData.type.length === 0) {
            return res.status(404).json({ message: "No stock entries found" });
        }

        const lastEntry = stackData.type.map(entry => ({
            materialId: entry.materialId.productName,
            lastValue: entry.values[entry.values.length - 1],
            lastDate: entry.date[entry.date.length - 1]
        }));
        res.status(200).json({ message: "Last stock entry retrieved successfully", lastEntry });

    } catch (error) {
        console.log("Error in stockproducts controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



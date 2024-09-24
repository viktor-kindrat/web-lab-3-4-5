import Insect from '../../models/insect.mjs';


export const getInsects = async (req, res) => {
    try {
        const insects = await Insect.find({});
        res.status(200).json(insects);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const createInsect = async (req, res) => {
    const insect = new Insect(req.body);

    try {
        await insect.save();
        res.status(201).json(insect);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


export const updateInsect = async (req, res) => {
    const {id} = req.params;

    try {
        const updatedInsect = await Insect.findByIdAndUpdate(id, req.body, {new: true});
        if (!updatedInsect) return res.status(404).json({message: 'Insect not found'});
        res.status(200).json(updatedInsect);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


export const deleteInsect = async (req, res) => {
    const {id} = req.params;

    try {
        const deletedInsect = await Insect.findByIdAndDelete(id);
        if (!deletedInsect) return res.status(404).json({message: 'Insect not found'});
        res.status(200).json({message: 'Insect deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

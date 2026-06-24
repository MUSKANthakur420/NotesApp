import mongoose from "mongoose"

const notesSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    theory: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, { timestamps: true })

export default mongoose.model("Note", notesSchema)
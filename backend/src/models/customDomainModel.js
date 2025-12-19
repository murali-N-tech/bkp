import mongoose from 'mongoose';

const customDomainSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    mainTopic: { type: String, default: '' },
    userPrompt: { type: String, required: true, trim: true },
    // New fields for Teacher Assignment feature
    isAssignment: { type: Boolean, default: false },
    questionLimit: { type: Number, default: 15 },
    questions: [{
    questionText: String,
    options: [String],
    correctIndex: Number,
    explanation: String
  }],
    icon: { type: String, default: 'Sparkles' },
    color: { type: String, default: 'hsl(48, 96%, 53%)' },
    difficulty: { type: Number, default: 3, enum: [1, 2, 3, 4, 5] },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    isCustom: { type: Boolean, default: true },
    courses: [
      {
        id: Number,
        name: String,
        icon: String,
        difficulty: Number,
        progress: { type: Number, default: 0 },
        color: String,
        description: String,
        duration: String,
        modules: Number,
        rating: Number,
        reviews: Number,
        keyTopics: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('CustomDomain', customDomainSchema);
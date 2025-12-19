import mongoose from 'mongoose';

const quizSessionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
    },
    domainId: {
      type: String,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Session', quizSessionSchema);

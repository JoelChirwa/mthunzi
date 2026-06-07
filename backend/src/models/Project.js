import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    goal: {
      type: String,
      default: null,
    },
    impact: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'ONGOING',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;

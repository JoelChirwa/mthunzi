import mongoose from 'mongoose';

const PageViewSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      index: true,
    },
    country: {
      type: String,
      default: null,
      index: true,
    },
    city: {
      type: String,
      default: null,
    },
    ipHash: {
      type: String,
      default: null,
    },
    device: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

PageViewSchema.index({ createdAt: 1 });

const PageView = mongoose.models.PageView || mongoose.model('PageView', PageViewSchema);

export default PageView;

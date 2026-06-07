import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'active',
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

const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);

export default Partner;

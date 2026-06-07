import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'MWK',
    },
    status: {
      type: String,
      default: 'PENDING',
    },
    paymentRef: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    message: {
      type: String,
      default: null,
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

const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);

export default Donation;

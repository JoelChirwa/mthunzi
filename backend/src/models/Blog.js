import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'DRAFT',
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

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;

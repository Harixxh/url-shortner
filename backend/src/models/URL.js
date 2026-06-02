const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      validate: {
        validator(url) {
          return /^https?:\/\/.+/.test(url);
        },
        message: 'Invalid URL format. Use http or https'
      }
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 6,
      maxlength: 10,
      match: [/^[a-zA-Z0-9_-]+$/, 'Short code can only contain alphanumeric characters, dash, and underscore']
    },
    customAlias: {
      type: String,
      sparse: true,
      unique: true,
      match: [/^[a-zA-Z0-9_-]+$/, 'Alias can only contain alphanumeric characters, dash, and underscore']
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0
    },
    lastClickedAt: {
      type: Date,
      sparse: true
    },
    qrCodeUrl: String,
    expiryDate: {
      type: Date,
      sparse: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    metadata: {
      title: String,
      description: String,
      tags: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: -1
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'urls', timestamps: true }
);

// Compound index for common queries
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ userId: 1, isActive: 1 });

// Check expiry before returning
urlSchema.methods.isExpired = function isExpired() {
  return this.expiryDate && new Date() > this.expiryDate;
};

module.exports = mongoose.model('URL', urlSchema);

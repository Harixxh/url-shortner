const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'URL',
      required: true,
      index: true
    },
    visitedAt: {
      type: Date,
      default: Date.now,
      index: -1
    },
    browser: {
      type: String,
      enum: [
        'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera',
        'IE', 'Mobile Safari', 'Chrome Mobile', 'Samsung Internet',
        'Unknown'
      ],
      default: 'Unknown'
    },
    device: {
      type: String,
      enum: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
      default: 'Unknown'
    },
    os: {
      type: String,
      default: 'Unknown',
      index: true
    },
    country: {
      type: String,
      minlength: 2,
      maxlength: 2,
      sparse: true,
      index: true
    },
    city: {
      type: String,
      sparse: true
    },
    ipHash: {
      type: String,
      sparse: true
    },
    referrer: {
      type: String,
      sparse: true
    },
    userAgent: String
  },
  { collection: 'visits', timestamps: false }
);

// Compound indexes for analytics queries
visitSchema.index({ urlId: 1, visitedAt: -1 });
visitSchema.index({ urlId: 1, device: 1 });
visitSchema.index({ urlId: 1, browser: 1 });
visitSchema.index({ urlId: 1, os: 1 });
visitSchema.index({ urlId: 1, country: 1 });

// TTL Index: Auto-delete visits older than 90 days
visitSchema.index(
  { visitedAt: 1 },
  { expireAfterSeconds: 7776000 } // 90 days
);

module.exports = mongoose.model('Visit', visitSchema);

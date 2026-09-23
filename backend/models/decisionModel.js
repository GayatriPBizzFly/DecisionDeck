const mongoose = require("mongoose");

const decisionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    priority: {
      type: String,
      default: "Medium",
    },

    options: {
      type: [String],
      default: [],
    },

    // NEW: decision evaluation criteria
        criteria: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          weight: {
            type: Number,
            default: 1,
          },
        },  
      ],
      default: [],
    },

    scores: {
  type: [
    {
      option: {
        type: String,
        required: true,
      },

        criteriaScores: {
          type: [
            {
              criterion: {
                type: String,
                required: true,
              },

              score: {
                type: Number,
                min: 1,
                max: 10,
                default: 1,
              },
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },

  isPinned: {
    type: Boolean,
    default: false
  },

  pinnedAt: {
    type: Date,
    default: null
  },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Decision", decisionSchema);
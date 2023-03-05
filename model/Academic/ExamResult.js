const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examResultSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    passMark: {
      type: Number,
      required: true,
      default: 50,
    },
    answeredQuestions: [
      {
        type: Object,
      }
    ],
    //failed/Passed
    status: {
      type: String,
      required: true,
      enum: ["fail", "pass"],
      default: "fail",
    },
    //Excellent/Good/Poor
    remarks: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Fair", "Poor"],
      default: "Poor",
    },
    position: {
      type: Number,
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    classLevel: {
      type: Schema.Types.ObjectId,
      ref: "ClassLevel",
    },
    academicTerm: {
      type: Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamResult", examResultSchema);

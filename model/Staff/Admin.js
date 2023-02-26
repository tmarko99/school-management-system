const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: "admin",
      },
      academicTerms: [
        {
          type: Schema.Types.ObjectId,
          ref: "AcademicTerm",
        },
      ],
      programs: [
        {
          type: Schema.Types.ObjectId,
          ref: "Program",
        },
      ],
      yearGroups: [
        {
          type: Schema.Types.ObjectId,
          ref: "YearGroup",
        },
      ],
      academicYears: [
        {
          type: Schema.Types.ObjectId,
          ref: "AcademicYear",
        },
      ],
      classLevels: [
        {
          type: Schema.Types.ObjectId,
          ref: "ClassLevel",
        },
      ],
      teachers: [
        {
          type: Schema.Types.ObjectId,
          ref: "Teacher",
        },
      ],
      students: [
        {
          type: Schema.Types.ObjectId,
          ref: "Student",
        },
      ],
    },
    {
      timestamps: true,
    }
  );
  
module.exports = mongoose.model("Admin", adminSchema);

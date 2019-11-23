const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  coursename:{type: String, unique: true, required: true},
  teachers: {type:[{type:String, required: true}]},
  createdDate: { type: Date, default: Date.now },
  AA: {type: Number, default: 1},
  students: {type:[{type: String}]}, 
  studentSize: {}
});

schema.set("toJSON",{virtuals: true});

module.exports = mongoose.model("Course", schema);

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      default: uuidv4, 
      required: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true, 
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ], 
    },
  },
  {
    versionKey: false, 
    timestamps: false, 
  }
);

ticketSchema.index({ code: 1 }, { unique: true });

const TicketModel = mongoose.model("Ticket", ticketSchema);

export default TicketModel;

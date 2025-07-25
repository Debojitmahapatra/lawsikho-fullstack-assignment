import ShareModel from '../models/share.model.js';
import UserModel from '../models/user.model.js';
import NoteModel from '../models/note.model.js';

import { isValidObjectId } from '../utils/valid.js'; 

export const shareNote = async (req, res) => {
  try {
    const fromUser = req.user.userID;
    const noteId = req.params.noteId;
    const { name, permission } = req.body;

    //  Validation
    if (!isValidObjectId(noteId)) {
      return res.status(400).send({ status: false, message: "Invalid noteId" });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).send({ status: false, message: "Please provide  name" });
    }

    if (permission && !['read', 'write'].includes(permission)) {
      return res.status(400).send({ status: false, message: "Permission must be 'read' or 'write'" });
    }

    //  Check if note exists
    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.status(404).send({ status: false, message: "Note not found" });
    }

    // Find toUser by name
    const toUser = await UserModel.findOne({ name: name.trim() });
    if (!toUser) {
      return res.status(404).send({ status: false, message: "Recipient user not found" });
    }

    //  Prevent sharing to self
    if (toUser._id.toString() === fromUser.toString()) {
      return res.status(400).send({ status: false, message: "You cannot share a note with yourself" });
    }

    //  Prevent duplicate share
    const existingShare = await ShareModel.findOne({
      fromUser,
      toUser: toUser._id,
      noteId
    });

    if (existingShare) {
      return res.status(400).send({ status: false, message: "This note is already shared with this user" });
    }

    //  Create share entry
    const sharedNote = await ShareModel.create({
      fromUser,
      toUser: toUser._id,
      noteId,
      permission: permission || 'read'
    });

    res.status(201).send({ status: true,  message: "Note shared successfully", data: sharedNote });

  } catch (err) {
     console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
  }
};


export const getSharedNotes = async (req, res) => {
  try {
    const toUserId = req.user.userID;

    const sharedNotes = await ShareModel.find({ toUser: toUserId })
      .populate({
        path: 'noteId',
        select: 'title content tags createdAt updatedAt owner'
      })
      .populate({
        path: 'fromUser',
        select: 'name email' 
      });

    if (!sharedNotes.length) {
      return res.status(404).send({ status: false, message: "No notes shared with you yet" });
    }

    res.status(200).send({ status: true,  message: "Shared notes fetched successfully",  data: sharedNotes });

  } catch (err) {
     console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
  }
};
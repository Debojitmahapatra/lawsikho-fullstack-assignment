import noteModel from "../models/note.model.js";
import userModel from "../models/user.model.js";
import { isValid, isValidObjectId } from "../utils/valid.js";
import RecordModel from "../models/record.model.js";

//create node
export const createNode = async (req, res) => {
  try {
    let { title, content, tags } = req.body;
    if (!isValid(title)) { return res.status(400).send({ status: false, message: "Please enter a title" }) }


    let owner = req.user.userID;

    let finalNode = {
      title,
      content,
      tags,
      owner
    }
    const createNoteWithFinalData = await noteModel.create(finalNode);

    if (Array.isArray(tags) && tags.length > 0) {
      let record = await RecordModel.findOne();

      if (!record) {
        // If no record exists, create one with tags
        const newTags = tags.map(tag => ({ tagName: tag, tagCount: 1 }));
        await RecordModel.create({ tags: newTags });
      } else {
        for (let tag of tags) {
          let tagEntry = record.tags.find(entry => entry.tagName === tag);

          if (tagEntry) {
            tagEntry.tagCount += 1;
          } else {
            record.tags.push({ tagName: tag, tagCount: 1 });
          }
        }
        await record.save();
      }
    }
    res.status(201).send({ success: true, message: "note created successfully", data: createNoteWithFinalData })



  } catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ message: "Error", error: err.message })
  }
}

export const getNodes = async (req, res) => {
  try {
    let userID = req.user.userID;
    if (!isValid(userID)) { return res.status(400).send({ status: false, message: "userID not present" }) }
    if (!isValidObjectId(userID)) { return res.status(400).send({ status: false, message: "userID not valid" }) }

    let allNodes = await noteModel.find({ isArchived: false, owner: userID });

    if (allNodes.length == 0) { return res.status(404).send({ status: false, message: "no node found" }) }

    res.status(201).send({ success: true, message: "nodes found successfully", data: allNodes })
  } catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ message: "Error", error: err.message })
  }
}
export const updateNodes = async function (req, res) {
  try {
    let id = req.params.nodeId
    if (!isValid(id)) {
      return res.status(400).send({ status: false, message: "Please enter nodeId" })
    }
    id = id.trim()
    if (!isValidObjectId(id)) {
      return res.status(400).send({ status: false, message: "Please enter valid nodeId" })
    }
    let { title, content, tags } = req.body;


    let findNode = await noteModel.findById(id)

    if (!findNode || findNode.isArchived == true) {
      return res.status(404).send({ status: false, message: "No node found" })
    }

    //authenticate 
    if (req.user.userID != findNode.owner.valueOf()) return res.status(403).send({ status: false, message: "Not allowed to modify another data" })


    let newTag
    if (tags) {
      newTag = [...new Set([...findNode.tags, ...tags])]
    }



    let obj = {
      title,
      content,
      tags: newTag
    }

    let updateNode = await noteModel.findOneAndUpdate({ _id: id, isArchived: false }, { $set: obj }, { new: true })


    // Update Record model only for new tags
    if (Array.isArray(tags) && tags.length > 0) {
      let record = await RecordModel.findOne();

      if (!record) {
        // If no record exists, create one with tags
        const tagData = tags.map(tag => ({ tagName: tag, tagCount: 1 }));
        await RecordModel.create({ tags: tagData });
      } else {
        for (let tag of tags) {
          // Only update tags that are newly added
          if (!findNode.tags.includes(tag)) {
            let existingTag = record.tags.find(entry => entry.tagName === tag);

            if (existingTag) {
              existingTag.tagCount += 1;
            } else {
              record.tags.push({ tagName: tag, tagCount: 1 });
            }
          }
        }
        await record.save();
      }
    }

    res.status(200).send({ status: true, message: "node updated successfully", data: updateNode })

  } catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ message: "Error", error: err.message })
  }
}

export const deleteNodes = async function (req, res) {
  try {
    let id = req.params.nodeId
    if (!isValid(id)) {
      return res.status(400).send({ status: false, message: "Please enter nodeId" })
    }
    id = id.trim()
    if (!isValidObjectId(id)) {
      return res.status(400).send({ status: false, message: "Please enter valid nodeId" })
    }

    let findNode = await noteModel.findById(id)

    if (!findNode || findNode.isArchived == true) {
      return res.status(404).send({ status: false, message: "No node found" })
    }

    //authenticate 
    if (req.user.userID != findNode.owner.valueOf())
      return res.status(403).send({ status: false, message: "Not allowed to modify another data" })


    await noteModel.findOneAndUpdate({ _id: id, isArchived: false }, { $set: { isArchived: true, updatedAt: Date.now() } }, { new: true })

    res.status(200).send({ status: true, message: "node deleted successfully" })

  } catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ message: "Error", error: err.message })
  }
}



export const getNodeById = async (req, res) => {
  try {
    let id = req.params.nodeId

    if (!isValidObjectId(id)) { return res.status(400).send({ status: false, message: "Please enter valid noteId" }) }

    const findUser = await noteModel.findById({ _id: id, isArchived: false })

    if (!findUser) { return res.status(404).send({ status: false, message: "No note found" }) }
    res.status(200).send({ status: true, message: 'note found', data: findUser });
  } catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ message: "Error", error: err.message })
  }
}

export const searchByKey = async function (req, res) {
  try {
    let key = req.params.key;
       let userID = req.user.userID;
    if (!isValid(userID)) { return res.status(400).send({ status: false, message: "userID not present" }) }
    if (!isValidObjectId(userID)) { return res.status(400).send({ status: false, message: "userID not valid" }) }

  

    let result = await noteModel.find({
      owner: userID,
      isArchived: false,
      $or: [
        { title: { $regex: key, $options: 'i' } },
        { category: { $regex: key, $options: 'i' } },
        { tags: { $regex: key, $options: 'i' } },
      ]
    });

    if (result.length > 0) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send({ status: false, message: "No match found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

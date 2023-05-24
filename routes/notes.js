const express = require("express");
const Route = express.Router();
const model = require("../models/User");
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const user = model.user;

//Route 1:get all notes using GET "/api/notes/allnotes".login required
Route.get("/allnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error occured");
  }
});

//Route 2:creating a new note using POST "/api/notes/createnote".login required
Route.post(
  "/createnote",
  fetchuser,
  [
    body("title", "title length error").isLength({ min: 1 }),
    body("description", "description is too short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // if there are any errors ,return bad request
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        return res.status(400).json({ errors: errs.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 3: updating a note by POST '/api/notes/updatenote/:id' ,login required
Route.put("/updatenote/:id", fetchuser,async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const newNote = {}
        if(title){
            newNote.title=title;
        }
        if(description){
            newNote.description=description;
        }
        if(tag){
            newNote.tag=tag;
        }

        // find the not to be updated and update it

        let note=await Notes.findById({id:"req.params.id"});
        
        if(!note){
            return res.status(404).send("Not found");
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note=await Notes.findByIdAndUpdate({id: "req.params.id"},{$set:newNote},{new:true});     
        res.json({note});


    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  });

  //delete existing note using delete '/api/notes/deletenote/:id' , login required

  Route.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        let note=await Notes.findById({id:"req.params.id"});
        
        if(!note){
            return res.status(404).send("Not found");
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

      note=await Notes.findByIdAndDelete({id: "req.params.id"} );
      res.json({"success":"deleted"});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  });

exports.Route = Route;

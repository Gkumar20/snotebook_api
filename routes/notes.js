const express = require('express')
const router = express.Router()
const Notes = require("../models/Notes")
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');



//Route- 1: fetch all notes  using : GET at "/api/notes/fetchallnotes"  login require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes) 
    return
  } catch (error) {
    console.error(error.message)
    // error send as a response at status 500
    return res.status(500).send("Internal Error Occured") 
  }
})


//Route- 2: create Notes using : POST at "/api/notes/addnote"  login require
router.post('/addnote', fetchuser, [
  //here chekcing  of title  is valid or not 
  body('title', "Enter Valid Title").isLength({ min: 3 }),
  // Description must be at least 5 chars long min:5
  body('description', "Discription must be greater than 5 character").isLength({ min: 5 }),
], async (req, res) => {
  try {

    //destructuring or take data by user entered
    const { title, description, tag } = req.body
    //validator check the error of title & description 
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // post the data into databse 
    const note = new Notes({
      title, description, tag, user: req.user.id
    })
    const savenote = await note.save()
    res.json(savenote)
    // return

  } catch (error) {
    console.error(error.message)
    // error send as a response at status 500
    return res.status(500).send("Internal Error Occured") 
  }
})



//Route- 3: update notes  using : PUT at "/api/notes/updatenote"  login require
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {

    //take note data from user
    const { title, description, tag } = req.body;

    //  creating a new notes ...which have all the value which value want to change user 
    const newNotes = {};
    if (title) { newNotes.title = title }
    if (description) { newNotes.description = description }
    if (tag) { newNotes.tag = tag }

    // find the notes to be update  using id 
    let note =await Notes.findById(req.params.id)
    //if notes not found
    if(!note){
      return res.status(404).send("Notes not found ")
    }
    //if user is not same then we cannot access to update the notes
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("Note allowed ")
    }
    // now update the notes
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true})
    res.json(note)
  } catch (error) {
    console.error(error.message)
    // error send as a response at status 500
    return res.status(500).send("Internal Error Occured") 
  }
})




//Route- 4: update notes  using : DELETE at "/api/notes/deletenote"  login require
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    // find the notes to be update  using id 
    let note =await Notes.findById(req.params.id)
    //if notes not found
    if(!note){
      return res.status(404).send("Notes not found ")
    }

    //if user is not same then we cannot give access to delete the notes
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("Note allowed ")
    }

    // now delete the notes
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Sucess":"Notes has been sucessfully deleted"})

  } catch (error) {
    console.error(error.message)
    // error send as a response at status 500
    return res.status(500).send("Internal Error Occured") 
  }
})


module.exports = router
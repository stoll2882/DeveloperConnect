const express = require('express');
// const request = require('request');
// const config = require('config');
const router = express.Router();
// const auth = require('../../middleware/auth');
// const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('database.mongoURI');
const mongodb = require("mongodb").MongoClient;
const db = config.get('database.mongoURI');
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const auth = require('../../middleware/auth');

// @route   GET api/csv
// @desc    Get current DB data into csv file
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    var client = await mongodb.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    var array = await client.db("DeveloperConnect").collection('users').find({}).toArray();

    const csvWriter = createCsvStringifier({
        header: [
          { id: "_id", title: "_id" },
          { id: "name", title: "name" },
          { id: "type", title: "type" },
          { id: "email", title: "email" },
          { id: "avatar", title: "avatar" }
        ]
    });

    var headers = csvWriter.getHeaderString();
    var result = `${headers}${csvWriter.stringifyRecords(array)}`;
    
    res.send(result);
    client.close();
    res.end();
  } catch (err) {
    console.log(err);
  }
});

const flattenEducation = (education) => {
  if (education == undefined) { return '' };
  var newEducation = '';
  newEducation += `Current: ${education.current}\n`;
  newEducation += `School: ${education.school}\n`;
  newEducation += `Degree: ${education.degree}\n`;
  newEducation += `Field of Study: ${education.fieldofstudy}\n`;
  newEducation += `From Date: ${education.from}\n`;
  newEducation += `To Date: ${education.to}\n`;
  newEducation += `Description: ${education.description}`;
  return newEducation;
}

const flattenExperience = (experience) => {
  if (experience == undefined) { return '' };
  var newExperience = '';
  newExperience += `Current: ${experience.current}\n`;
  newExperience += `Title: ${experience.title}\n`;
  newExperience += `Company: ${experience.company}\n`;
  newExperience += `Location: ${experience.location}\n`;
  newExperience += `From Date: ${experience.from}\n`;
  newExperience += `To Date: ${experience.to}\n`;
  newExperience += `Description: ${experience.description}`;
  return newExperience;
}

const flattenSocials = (social) => {
  if (social == undefined) { return '' };
  var newSocial = '';
  newSocial += `YouTube: ${social.youtube}\n`;
  newSocial += `Twitter: ${social.twitter}\n`;
  newSocial += `Instagram: ${social.instagram}\n`;
  newSocial += `LinkedIn: ${social.linkedin}\n`;
  newSocial += `Facebook: ${social.facebook}\n`;
  return newSocial;
}

// @route   GET api/csv/profiles
// @desc    Get current DB profile data into csv file
// @access  Private
router.get('/profiles', auth, async (req, res) => {
    try {
      var client = await mongodb.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
      var array = await client.db("DeveloperConnect").collection('profiles').find().toArray();

      for (const profile of array) {
        profile.education1 = flattenEducation(profile.education[0]);
        profile.education2 = flattenEducation(profile.education[1]);
        profile.education = undefined;

        profile.experience1 = flattenExperience(profile.experience[0]);
        profile.experience2 = flattenExperience(profile.experience[1]);
        profile.experience3 = flattenExperience(profile.experience[2]);
        profile.experience = undefined;

        profile.social = flattenSocials(profile.social);
      }

      // const formattedArray = array.map(profile => formatArray(profile));


      const csvWriter = createCsvStringifier({
          header: [
            { id: "_id", title: "_id" },
            { id: "user", title: "userID" },
            { id: "bio", title: "bio" },
            { id: "skills", title: "skills" },
            { id: "education", title: "education" },
            { id: "social.youtube", title: "youtube" },
          ]
      });
  
      var headers = csvWriter.getHeaderString();
      var result = `${headers}${csvWriter.stringifyRecords(array)}`;
      
      res.send(array);
      client.close();
      res.end();
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
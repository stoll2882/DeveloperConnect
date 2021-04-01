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
// const axios = require('axios');
const normalize = require('normalize-url');
const gravatar = require('gravatar');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

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

const combine = (user, profile) => {
  var newUser = {
    id: '',
    name: '',
    type: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    bio: '',
    skills: '',
    education1: '',
    education2: '',
    experience1: '',
    experience2: '',
    experience3: '',
    social: ''
  }
  newUser.id = user._id;
  newUser.name = user.name;
  newUser.type = user.type;
  newUser.email = user.email;
  newUser.avatar = user.avatar;
  newUser.phoneNumber = user.phoneNumber;

  if (profile) {
    if (profile.bio) {
      newUser.bio = profile.bio;
    }
    if (profile.skills) {
      newUser.skills = profile.skills;
    }
    if (profile.education1) {
      newUser.education1 = profile.education1;
    }
    if (profile.education2) {
      newUser.education2 = profile.education2;
    }
    if (profile.experience1) {
      newUser.experience1 = profile.experience1;
    }
    if (profile.experience2) {
      newUser.experience2 = profile.experience2;
    }
    if (profile.experience3) {
      newUser.experience3 = profile.experience3;
    }
    if (profile.social) {
      newUser.social = profile.social;
    }
    profile.user = undefined;
    newUser.user = undefined;
  }
  return newUser;
}

const handleCreateUser = async (userInfo) => {
  const { name, email, password, phoneNumber, type, id } = userInfo;
  if (!name || !email || !phoneNumber || !type || (!password && !id)) {
    return;
  }
  try {
    // See if the user exists
    let user = await User.findOne({ email });

    if (user) {
      return;
    }

    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    if (!password) {
      password = id;
    }
    user = new User({
      name,
      type,
      id,
      email,
      avatar,
      password,
      phoneNumber,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Place await in front of anything that returns a promise
    await user.save();

    return user._id;
  } catch (err) {
    console.error(err.message);
  }
}

const handleCreateProfile = async (userID, profileInfo) => {
  // destructure the request
  const {
    experience,
    education,
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    // spread the rest of the fields we don't need to check
    ...rest
  } = profileInfo;

  // build a profile
  const profileFields = {
    user: userID,
    website:
      website && website !== ''
        ? normalize(website, { forceHttps: true })
        : '',
    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => ' ' + skill.trim()),
    ...rest,
  };

  // Build socialFields object
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalize(value, { forceHttps: true });
  }
  // add to profileFields
  profileFields.social = socialFields;

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: userID },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log(profile);
  } catch (err) {
    console.error(err.message);
    // return res.status(500).send('Server Error');
  }
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

// @route   GET api/csv/combined
// @desc    Get current DB data from both piles into csv file
// @access  Private
router.get('/combined', auth, async (req, res) => {
  try {
    var client = await mongodb.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    var usersArray = await client.db("DeveloperConnect").collection('users').find({}).toArray();
    var profilesArray = await client.db("DeveloperConnect").collection('profiles').find().toArray();

    var finalArray = []

    for (const profile of profilesArray) {
      profile.education1 = flattenEducation(profile.education[0]);
      profile.education2 = flattenEducation(profile.education[1]);
      profile.education = undefined;

      profile.experience1 = flattenExperience(profile.experience[0]);
      profile.experience2 = flattenExperience(profile.experience[1]);
      profile.experience3 = flattenExperience(profile.experience[2]);
      profile.experience = undefined;

      profile.social = flattenSocials(profile.social);
    }

    for (const user of usersArray) {
      user.password = undefined;
      user.date = undefined;
      user.__v = undefined;
      var count = 0;
      for (const profile of profilesArray) {
        profile._id = undefined;
        if (String(user._id).localeCompare(String(profile.user)) === 0) {
          var combined = combine(user, profile);
          profile.user = undefined;
          finalArray.push(combined);
        } else {
          count += 1;
        }
      }
      if (count == profilesArray.length) {
        finalArray.push(user);
      }
    }
    
    res.send(finalArray);
    client.close();
    res.end();
  } catch (err) {
    console.log(err);
  }
});

// @route   POST api/csv/upload
// @desc    Get CSV data into MongoDB
// @access  Private
router.post('/upload', auth, async (req, res) => {
  var csvData = req.body;
  headers = csvData[0];
  csvData.shift();

  for (var i = 0; i < csvData.length; i++) {
    if (csvData[i].length < 5) {
      csvData.splice(i, 1);
    }
  }

  try {
    for (var i = 0; i < csvData.length; i++) {
      const user = csvData[i];
      var userData = {
        name: user[0],
        email: user[1],
        phoneNumber: user[2],
        type: 'self',
        password: user[38],
      }
      const userId = await handleCreateUser(userData);

      var profileData = {
        user: userId,
        bio: user[3],
        status: user[40],
        location: user[41],
        company: user[42],
        skills: user[4],
        education: [],
        experience: [],
        youtube: user[33],
        twitter: user[34],
        facebook: user[35],
        linkedin: user[36],
        instagram: user[37],
      }
      const education1 = {
        school: user[5],
        degree: user[6],
        fieldofstudy: user[7],
        from: user[8],
        to: user[9],
        current: user[10],
        description: user[11],
      }
      profileData.education.push(education1);
      const education2 = {
        school: user[12],
        degree: user[13],
        fieldofstudy: user[14],
        from: user[15],
        to: user[16],
        current: user[17].toLowerCase(),
        description: user[18],
      }
      profileData.education.push(education2);
      const experience1 = {
        title: user[19],
        company: user[20],
        location: user[21],
        from: user[22],
        to: user[23],
        current: user[24].toLowerCase(),
        description: user[25],
      }
      profileData.experience.push(experience1);
      const experience2 = {
        title: user[26],
        company: user[27],
        location: user[28],
        from: user[29],
        to: user[30],
        current: user[31].toLowerCase(),
        description: user[32],
      }
      profileData.experience.push(experience2);
      await handleCreateProfile(userId, profileData);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
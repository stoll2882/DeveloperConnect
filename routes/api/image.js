const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const { BlobServiceClient, ContainerClient, BlobSASPermissions } = require('@azure/storage-blob');

function generateProfileFilename(userid) {
  return "profile-"+userid;
}

// @route    GET api/image
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  const url = await getAzureSignedUrl(generateProfileFilename(req.user.id), 360);
  res.send(url).end();
  console.log(url);
});

// @route    POST api/image
// @desc     Get user by token
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    const profileStorageUrl = config.get('profilePics.storageUrl');

    // const user = await User.findById(req.user.id).select('avatar');
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          avatar: profileStorageUrl + generateProfileFilename(req.user.id)
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).end();
  } catch (err) {
    console.error(err.message);
  }
});

async function getAzureSignedUrl(fileName, minutesToExpiration) {
  const profileConnectionString = config.get('profilePics.connectionString');

  const containerName = 'profilepics';
  const connectionString = profileConnectionString;

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(fileName);
  const url = await blobClient.generateSasUrl(
    { 
      expiresOn: new Date(new Date().valueOf() + minutesToExpiration * 1000), // Required. Date type
      permissions: BlobSASPermissions.parse("racw") // Required
    }
  );
  return url;
}

module.exports = router;
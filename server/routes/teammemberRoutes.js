const TeamMember = require('../models/teammember');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const logger = require('../config/logger');
const {ensurePicAndWriteToDisk} = require('../services');

const upload = multer();
const {RESOURCES_DIR} = process.env;

const teammemberRoutes = app => {
  app.put('/api/teammember', auth, upload.single('pic'), (req, res) => {
    const file = req.file;
    const {name, info, type, designation} = req.body;

    if (!file) return res.status(400).send();
    if (!name || !info || !type) return res.status(400).send();

    ensurePicAndWriteToDisk(file, RESOURCES_DIR + '/team')
      .then(picPath => {
        const picUrl = picPath.replace(RESOURCES_DIR, '');
        return new TeamMember({
          name,
          info,
          type,
          designation,
          pic: picUrl
        }).save();
      })
      .then(teamMember => {
        res.send(teamMember);
      })
      .catch(e => {
        logger.error(e.message, e);
        res.status(400).send();
      });
  });

  app.patch('/api/teammember/:_id', auth, upload.single('pic'), (req, res) => {
    const file = req.file;
    const {name, info, designation} = req.body;

    if (!name || !info) return res.status(400).send();
    if (typeof designation !== 'string') return res.status(400).send();

    const _id = req.params._id;

    TeamMember.findById(_id).then(member => {
      if (!member) throw new Error('No member by id - ' + _id);

      member.name = name;
      member.info = info;
      member.designation = designation;

      if (file) {
        return ensurePicAndWriteToDisk(file, RESOURCES_DIR + '/team').then(picPath => {
          fs.unlinkSync(RESOURCES_DIR + member.pic);
          member.pic = picPath.replace(RESOURCES_DIR, '');
          return member.save();
        });
      } else {
        return member.save();
      }
    }).then(member => {
      res.send(member);
    }).catch(e => {
      logger.error(e.message, e);
      res.status(400).send();
    });
  });

  app.delete('/api/teammember/:_id', auth, (req, res) => {
    const _id = req.params._id;
    TeamMember.remove({_id}).then(() => {
      res.send(200);
    }).catch(e => {
      logger.error(e.measure, e);
      res.status(400).send();
    });
  });
};

module.exports = teammemberRoutes;

const express = require("express");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Journal, Playlist, Song, Filter } = require("../../db/models");
const { validateJournal } = require("../../utils/validation");

const router = express.Router();

/* GET ALL JOURNALS OF USER */
router.get("/session", requireAuth, async (req, res, next) => {
  const { user } = req;

  const journals = await Journal.findAll({
    where: { userId: user.dataValues.id },
    include: [
      {
        model: Filter,
        as: "filter",
      },
    ],
  });

  if (!journals.length) {
    res.json({ journals: [] });
  }

  res.json({ journals: journals });
});

/* GET JOURNALS BY ID */
router.get("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const journalId = req.params.id;

  const journal = await Journal.findOne({
    where: { id: journalId },
  });

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  res.json({ journal: journal });
});

/* CREATE A JOURNAL */
router.post("/", requireAuth, validateJournal, async (req, res, next) => {
  const { user } = req;
  const { filters, valence, energy } = req.body;
  console.log("JOURNAL CREATE REQ BODY: ", req.body);
  const newJournal = await Journal.create({
    userId: user.dataValues.id,
    name: req.body.name,
    content: req.body.content,
    image_url: req.body.image_url || null,
  });

  const countFilters = (filterObj) => {
    let count = 0;
    for (let i = 1; i <= 5; i++) {
      if (
        filterObj[`filter${i}`] !== null &&
        filterObj[`filter${i}`] !== undefined
      ) {
        count++;
      }
    }
    return count;
  };

  const filterData = {
    valence: valence,
    energy: energy,
  };

  for (let i = 0; i < 5; i++) {
    if (filters && i < filters.length) {
      filterData[`filter${i + 1}`] = filters[i];
    } else {
      filterData[`filter${i + 1}`] = null;
    }
  }

  const newFilter = await Filter.create({
    journalId: newJournal.id,
    ...filterData,
  });

  const reorderedJournal = {
    id: newJournal.id,
    userId: newJournal.userId,
    name: newJournal.name,
    content: newJournal.content,
    image_url: newJournal.image_url,
    createdAt: newJournal.createdAt,
    updatedAt: newJournal.updatedAt,
    filter: newFilter,
    filterCount: countFilters(newFilter),
  };

  res.json({ journal: reorderedJournal });
});

/* UPDATE JOURNAL BY ID */
router.put("/:id", requireAuth, validateJournal, async (req, res, next) => {
  const { user } = req;
  const { filters, valence, energy } = req.body;
  const journalId = req.params.id;

  console.log("JOURNAL UPDATE REQ BODY: ", req.body);

  const journal = await Journal.findOne({
    where: { id: journalId },
    include: [
      {
        model: Filter,
        as: "filter",
      },
    ],
  });

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  if (journal.userId !== user.dataValues.id) {
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  const filter = await Filter.findOne({
    where: { journalId: journalId },
  });

  const updatedJournal = await journal.update(req.body);

  const countFilters = (filterObj) => {
    let count = 0;
    for (let i = 1; i <= 5; i++) {
      if (
        filterObj[`filter${i}`] !== null &&
        filterObj[`filter${i}`] !== undefined
      ) {
        count++;
      }
    }
    return count;
  };

  let updatedFilter;

  const filterData = {
    valence: valence,
    energy: energy,
  };

  for (let i = 0; i < 5; i++) {
    if (filters && i < filters.length) {
      filterData[`filter${i + 1}`] = filters[i];
    } else {
      filterData[`filter${i + 1}`] = null;
    }
  }

  if (filter) {
    updatedFilter = await filter.update(filterData);
  }

  console.log("FILTER", filter);
  console.log("UPDATED FILTER", updatedFilter);

  const reorderedJournal = {
    id: updatedJournal.id,
    userId: updatedJournal.userId,
    name: updatedJournal.name,
    content: updatedJournal.content,
    image_url: updatedJournal.image_url,
    createdAt: updatedJournal.createdAt,
    updatedAt: updatedJournal.updatedAt,
    filter: updatedFilter,
    filterCount: countFilters(updatedFilter),
  };

  res.json({ journal: reorderedJournal });
});

/* DELETE JOURNAL BY ID */
router.delete("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const journalId = req.params.id;

  const journal = await Journal.findOne({
    where: { id: journalId },
  });

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  if (journal.userId !== user.dataValues.id) {
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  await journal.destroy();

  res.json({ message: "Journal deleted successfully" });
});

/* UPDATE FILTER BY JOURNAL ID*/
router.put("/:id/filter", requireAuth, async (req, res, next) => {
  const journalId = req.params.id;

  const journal = await Journal.findByPk(journalId);

  if (!journal) {
    return next({
      errors: { journal: "Journal could not be found", status: 404 },
    });
  }

  if (journal.userId !== req.user.dataValues.id) {
    return next({
      errors: { journal: "Unauthorized Access", status: 401 },
    });
  }

  const filter = await Filter.findOne({ where: { journalId: journal.id } });

  if (!filter) {
    return next({
      errors: { filter: "Filter could not be found", status: 404 },
    });
  }

  const updatedFilter = await filter.update(req.body);

  res.json({ journal: { ...updatedJournal, filter } });
});

module.exports = router;

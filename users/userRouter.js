const express = require("express");
const db = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  db.insert(req.body)
    .then(() => {
      res.status(201).json(req.body);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to upload" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  postDb
    .insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to upload" });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The information could not be retrieved" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
    .then((posts) => {
      posts
        ? res.status(200).json(posts)
        : res.status(404).json({ message: "there are no posts to display" });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "success" });
    })
    .catch(() => {
      res.status(500).json({ message: "unable to delete the user" });
    });
});

router.put("/:id", (req, res) => {
  db.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json(req.body);
    })
    .catch(() => {
      res.status(500).json({ message: "unable to update user info" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "failed to validate user ID" });
    });
}

function validateUser(req, res, next) {
  req.body === {} || !req.body
    ? res.status(400).json({ message: "missing user data" })
    : !req.body.name
    ? res.status(400).json({ message: "missing required name field" })
    : next();
}

function validatePost(req, res, next) {
  !req.body
    ? res.status(400).json({ message: "missing post data" })
    : req.body.text === "" || !req.body.text
    ? res.status(400).json({ message: "missing required text field" })
    : next();
}

module.exports = router;

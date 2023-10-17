// implement your posts router here
const Post = require("./posts-model");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    Post.find()
        .then(post => {
            res.status(200).json(post);
        }).catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved"
            })
        })
})

router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                res.status(200).json(post);
            }
        }).catch(err => {
            res.status(500).json({
                message: "The post information could not be retrieved"
            })
        })
})

router.post("/", (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
                    .then(post => {
                        res.status(201).json(post);
                    })
            }).catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            })
    }
})

router.put("/:id", (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.findById(req.params.id)
            .then(post => {
                if (!post) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    Post.update(req.params.id, req.body)
                        .then(data => {
                            Post.findById(data)
                                .then(result => {
                                    res.status(200).json(result)
                                }).catch(err => {
                                    res.status(500).json({
                                        message: "The post information could not be modified"
                                    })
                                })
                        }).catch(err => {
                            res.status(500).json({
                                message: "The post information could not be modified"
                            })
                        })
                }
            }).catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified"
                })
            })
    }
})

router.delete("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                Post.remove(req.params.id)
                    .then(data => {
                        console.log(post);
                        res.status(200).json(post)
                    }).catch(err => {
                        res.status(500).json({
                            message: "The post could not be removed"
                        })
                    })
            }
        }).catch(err => {
            res.status(500).json({
                message: "The post could not be removed"
            })
        })
})

router.get("/:id/comments", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                Post.findPostComments(req.params.id)
                    .then(data => {
                        res.status(200).json(data);
                    }).catch(err => {
                        res.status(500).json({
                            message: "The comments information could not be retrieved"
                        })
                    })
            }
        }).catch(err => {
            res.status(500).json({
                message: "The comments information could not be retrieved"
            })
        })
})



module.exports = router;
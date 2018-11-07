const models = require("../models");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE"
    });

    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };

  Comment.addScope("lastFiveFor", (userId) => {
  //  Include the `Post` for each `Comment` to build an anchor tag.
   const Post = require("../models").Post;
   return {
      include: [{
        model: Post
      }],
      where: { userId: userId},
      limit: 5,
      order: [["createdAt", "DESC"]]
    }
  });

  return Comment;
};

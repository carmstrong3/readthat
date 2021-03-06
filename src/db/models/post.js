'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
   
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });

    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });

    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });

    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });

  };

  Post.prototype.getPoints = function(){
    // Check for any posts, if none then return 0
    if(this.votes.length === 0) return 0
    // If there are votes, get a count of all values by adding them and returning the result. map function transforms the array and reduce goes over all values, reducing until one left, the total.
    return this.votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };

  Post.prototype.getFavoriteFor = function(userId){
    // Check all favorites on this post and return the one where userId in the favorite is the same as the passed userId
    return this.favorites.find((favorite) => { return favorite.userId == userId });
  };

  // Define the scope by calling addScope on the model.
  Post.addScope("lastFiveFor", (userId) => {
  // Return the implemented query
    return {
      where: { userId: userId},
  // Set a limit which establishes the maximum number of records the query will return. Order by newest first by the "createdAt" property of the post.
      limit: 5,
      order: [["createdAt", "DESC"]]
    }
  });

  return Post;
};

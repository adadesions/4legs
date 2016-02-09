Meteor.methods({
  updateProfile : function (newData) {
      Meteor.users.update({_id:this.userId},{
        $set:{
          "profile.birthday" : newData.birthday,
          "profile.topics" : newData.topics
        }
    })

      Accounts.setUsername(this.userId, newData.username)
    },

  updateProfilePicture : function (newId) {
    Meteor.users.update({_id:this.userId},{
      $set: {
        "profile.image._id" : newId
      }
    })
  },

  addFollowing : function (followingId) {
    Meteor.users.upsert({_id:this.userId},{
      $addToSet: {
        "profile.following" : {
          followingId : followingId,
          followAt : new Date()
        }
      }
    })
    Notify.insert({
      notifyTo : followingId,
      notifyFrom: Meteor.userId(),
      action: 'folowing',      
      read: false,
      createdAt: new Date()
    })
  },

  addFollower : function (followingId) {
    Meteor.users.upsert({_id:followingId},{
      $addToSet: {
        "profile.followers" : {
          followerId : this.userId,
          followerAt: new Date()
        }
      }
    })
  },

  checkFollowing : function (followingId) {
    let following = Meteor.user().profile.following
    return _.contains(_.pluck(following, 'followingId'), followingId)
  },

  unFollowing : function (followingId) {
    Meteor.users.update({_id:this.userId}, {
      $pull : {
        'profile.following': {
          'followingId' : followingId
      }}
    })
  },

  unFollower : function (followingId) {
    Meteor.users.update({_id:followingId}, {
      $pull : {
        'profile.followers' : {
          'followerId' : this.userId
        }
      }
    })
  },

  queryFollowing : function (id) {
    let following = Meteor.users.findOne({_id:id}),
        ids = following.profile.following,
        followingSet = _.map(ids, function (data) {
          return Meteor.users.findOne({_id:data.followingId})
        })
        return followingSet
  },

  verifyIdCard : function (idCardNo, tel) {
    let user = Meteor.user()
    if(user.profile.idCardNo){
      if(user.profile.idCardNo === idCardNo){
        console.log(typeof user.profile.idCardNo+" == "+typeof idCardNo);
        Meteor.users.upsert({_id:user._id}, {
          $set: {
            'profile.tel' : tel
          }
        })
        return true
      }
      else{
        console.log('here');
        return false
      }
    }
    else{
      Meteor.users.upsert({_id:user._id}, {
        $set: {
          'profile.idCardNo' : idCardNo,
          'profile.tel' : tel
        }
      })
      return true
    }
  },

  updateVetVerify: function (userId,bool) {
    Meteor.users.update({_id:userId}, {$set: {'profile.vetInfo.verified':bool}})
  }
})

Topices = new Mongo.Collection('topices');
var topicData = {
  data: [
          'สุนัข',
          'แมว',
          'pocket pet',
          'นก',
          'สัตว์เลื้อยคลาย',
          'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ',
          'สถานพยาบาล',
          'บริการสัตว์เลี้ยง',
          'ร้านค้า',
        ]
}

Meteor.methods({
  'getTopics' : function () {
    var data = Topices.find()
    return data
  }
})

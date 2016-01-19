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
  ],
  animalType : [
    'สุนัข',
    'แมว',
    'pocket pet',
    'นก',
    'สัตว์เลื้อยคลาน',
    'สัตว์น้ำ/สัตว์ครึ่งบกครึ่งน้ำ',
  ]
}

if(Topices.find().count() === 0) Topices.insert(topicData)
if(Posts.find().count() === 0) Posts.insert({test:'test'})
if(Ads.find().count() === 0) Ads.insert({test:'test'})

import models from '../models'

export const createUsersWithMessages = async date => {
  const user1 = new models.User({
    username: 'rwieruch',
    email: 'hello@robin.com',
    password: 'rwieruch',
    role: 'ADMIN',
  });

  const user2 = new models.User({
    username: 'ddavids',
    email: 'hello@david.com',
    password: 'ddavids',
  });

  const message1 = new models.Message({
    text: 'Published the Road to learn React',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user1.id,
  });

  const message2 = new models.Message({
    text: 'Happy to release ...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user2.id,
  });

  const message3 = new models.Message({
    text: 'Published a complete ...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user2.id,
  });

  await user1.save();
  await user2.save();

  await message1.save();
  await message2.save();
  await message3.save();
  console.log('database loaded!!! FWERF#$RTF')
};

'use strict';

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Conventional FOR
for (const movement of movements) {
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
}

//**ForEach
console.log('===================FOR EACH==============');
movements.forEach(movement => {
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
});

//Getting the index in both FOR

for (const [i, mov] of movements.entries()) {
  if (mov > 0) console.log(`Movement ${i + 1}: You deposited ${mov}`);
  else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
}

console.log('===================FOR EACH==============');

movements.forEach((mov, i) => {
  if (mov > 0) console.log(`Movement ${i + 1}: You deposited ${mov}`);
  else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
});

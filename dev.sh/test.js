console.log('code runner playground');

const ob1 = { foo: 'loren' };
const ob2 = { fav: 'test ' };
const ob3 = { foo: null };
const daBoo = true;
console.log({ ...ob1, ...ob2, ...(daBoo && ob3) });

console.log(
	Math.random()
		.toString()
		.substr(2)
);

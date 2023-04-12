 Sort an Array

<Code language="javascript">
//strings
const names = ["Seema", "Rekha", "Jaya"];
names.sort();
//['Jaya', 'Rekha', 'Seema' ]

//Numbers
const numbers = [101, 8, 87];
numbers.sort((a, b) => {
  return a - b;
});
//[ 8, 87, 101 ]
</Code>

 Select a random element

<code language="bash">
cat /proc/cpuinfo
</code>

 Reverse a string

<Code language="javascript">
function reverseString(string) {
  return string.split(" ").reverse().join(" ")
}

revereseString("Random String")
</Code>

 Check if element has a class

<Code language="javascript">
const element = document.querySelector("#element")
element.classList.contains("active")
</Code>

 String interpolation

<Code language="javascript">
const name = "Jaya"
console.log(`Hi, ${name}. You have ${2 ** 3} new notifications.`}
//Hi, Jaya. You have 8 new notifications.
</Code>

 Loop through an array

<Code language="javascript">
const cars = ["Ford", "BMW", "Audi" ]
for (let car of cars) {
  console.log(car)
}

/*
Ford
BMW
Audi
*/
</Code>
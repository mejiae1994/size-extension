// Check if the element already exists
var existingDiv = document.getElementById("myExtensionDiv");

if (existingDiv) {
  console.log("removing content");
  // If the element exists, remove it
  existingDiv.remove();
} else {
  // If the element doesn't exist, create and inject it
  console.log("adding content");
  var newDiv = document.createElement("div");
  newDiv.id = "myExtensionDiv";
  newDiv.style.position = "fixed";
  newDiv.style.top = "0px";
  newDiv.style.left = "0px";
  newDiv.style.width = "200px";
  newDiv.style.height = "200px";
  newDiv.style.zIndex = 10000;
  newDiv.style.backgroundColor = "#f00";
  newDiv.innerHTML = "Hello, world!";
  document.body.appendChild(newDiv);
}

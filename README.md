# recipe-finder
Find recipes based on the ingredients found in the image provided.

It first sends data to the back-end, which will parse the information and send a request to an image recognition AI which will then give a list of ingredients found in the image.

With that information is will call another API, with a list of ingredients as input, and a handful of recipes as output.

This way, you may find somewhat similar recipes to the imput image. 

Note that it is based on ingredients, so the end dish may be different than the source dish, but it should have similar ingredients.

For example if the input dish is sushi (which has rice and seafood) you may get recipes for paella, because it also has rice and seafood. This is not a bug.

try a working example at https://recipe-finder-demo.herokuapp.com/

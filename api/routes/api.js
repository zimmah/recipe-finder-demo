const express = require('express');
const Clarifai = require('clarifai');
const fs = require('fs').promises;
const router = express.Router();
const fetch = require('node-fetch');

const getKeys = async () => {
  const result = await fs.readFile(`${__dirname}/../keys.json`);
  const keys = await JSON.parse(result);
  return keys;
}

router.post('/', async function(req, res, next) {
  const {clarifai, edamam} = await getKeys();
  const query = req.body.url || new Uint8Array(req.body);
  const api = new Clarifai.App({
    apiKey: clarifai
  });
  const apiResponse = await api.models
    .predict("bd367be194cf45149e75f01d59f77ba7", query);
  const apiData = apiResponse;
  const parseIngedients = (ingredients, ingredient) => (
    ingredient.value >= 0.9 ? [...ingredients, ingredient.name] : ingredients
  );
  const ingredients = apiData.outputs[0].data.concepts
    .slice(0, 5)  
    .reduce(parseIngedients, []);
  const parseRecipes = hit => {
    const { recipe } = hit;
    const { url, image, label: title } = recipe;
    return {url, title, image};
  };

  const recipesResponse = await fetch(`https://api.edamam.com/search?q=${ingredients.join('+')}&app_id=${edamam.id}&app_key=${edamam.key}`);
  const recipes = await recipesResponse.json();
  const recipesParsed = recipes.hits.map(parseRecipes);
  console.log('response', JSON.stringify(recipesParsed));
  res.send(JSON.stringify(recipesParsed));
});

module.exports = router;

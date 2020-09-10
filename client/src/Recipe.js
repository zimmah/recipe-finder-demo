import React from 'react';
import './Recipe.css';

class Recipe extends React.Component {
  render() {
    if(this.props.data){
      const { title, url, image } = this.props.data;
      return (
        <div className="Recipe-card">
          <img src={image} alt={title} className="Recipe-img" />
          <div className="Recipe-card-container">
            <h1 className="Recipe-card-title">{title}</h1>
            <p><a href={url} className="Recipe-link">View Recipe</a></p>
          </div>
        </div>
      )
    }
    return null;
  }
}

export default Recipe;
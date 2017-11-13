import React from 'react';
import $ from 'jquery';


class Story extends React.Component {
  render() {
    let id = this.props.id;
    let title = this.props.title;
    let date = this.props.date;

    return(
      <div className="flex-item">
        <p className="number">{ id }.</p>
        <p className="title">{ title }</p>
        <p className="date">{ date }</p>
      </div>
    );
  }
}


class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      limit: 10,
      offset: 0
    };
    this.getStories = this.getStories.bind(this);
    this.updateStories = this.updateStories.bind(this);
  }
  
  componentDidMount() {
    // First, load initial stories into state and render
    // Begin listening for scroll events
    this.getStories(this.state.limit);
    window.addEventListener('scroll', this.updateStories);
  }
  
  componentDidUpdate() {
    // After initial load check if there is extra room on page
    // If yes, load stories until page is full
    let noScroll = window.innerHeight === document.body.scrollHeight;
    let noUpdate = this.state.offset === 0;
    if (noScroll && noUpdate) {
      this.getStories(this.state.limit * 2);
    }
  }  

  componentWillUnmount() {
    // Cease listening for scroll events on exit
    window.removeEventListener('scroll', this.updateStories);
  }
    
  getStories(limit) {
    // Load initial list of stories
    // Will reload with bigger limit if stories do not fill page
    // New limit stored in state
    let query = 
      'https://www.stellarbiotechnologies.com/media/press-releases/json' + 
      '?limit=' + limit;
    $.getJSON(query).then(({ news }) => this.setState(
      { 
        stories: news, 
        limit: limit
      }
    ));
  }
  
  updateStories(event) {
    // Make sure that the user has scrolled to the bottom of the page
    // Check whether this request has already been attempted
    // Then append new stories to list and save new offset to state
    let scrollAtBottom = 
      window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    let storiesUpdated =
      this.state.stories.length / this.state.limit === this.state.offset + 1;
    if (scrollAtBottom && storiesUpdated) {
      let query = 
        'https://www.stellarbiotechnologies.com/media/press-releases/json' + 
        '?limit=' + this.state.limit + 
        '&offset=' + this.state.limit * (this.state.offset + 1);
      $.getJSON(query).then(({ news }) => this.setState(
        { 
          stories: this.state.stories.concat(news),
          offset: this.state.offset + 1
        }
      ));
    }
  }
  
  render() {
    const storyList = this.state.stories.map((item, i) => (
      <Story 
        key = { item.published }
        id = { i + 1 }
        title = { item.title }
        date = { item.published } />
    ));

    return (
      <div id="base" className="flex-container">
        <div className="flex-item" id="header">
          <p className="title">News Feed</p>
        </div>
        { storyList }
      </div>
    );
  }
}

export default NewsFeed;

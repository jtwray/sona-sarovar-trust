import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'react-icons-kit';
import {chevronLeft, chevronRight} from 'react-icons-kit/fa';

class ImageCarousal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentShowingImageIndex: 0
    };

    this.updateShowingImage = this.updateShowingImage.bind(this);
    this.isImageShowing = this.isImageShowing.bind(this);
    this.showImageAtIndex = this.showImageAtIndex.bind(this);

    this.intervalHandler = setInterval(() => {
      this.updateShowingImage();
    }, props.viewDuration);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandler);
  }


  showImageAtIndex(index) {
    this.setState({currentShowingImageIndex: index});
  }

  updateShowingImage(goForwardBy = 1) {
    let newIndex =
      (this.state.currentShowingImageIndex + goForwardBy) % this.props.imageLinks.length;
    if (newIndex < 0) newIndex += this.props.imageLinks.length;
    this.showImageAtIndex(newIndex);
  }

  isImageShowing(index) {
    return this.state.currentShowingImageIndex === index;
  }

  render() {
    const {dots, arrows, imageLinks} = this.props;
    const {currentShowingImageIndex} = this.state;
    return (

      <div className="carousal-image-container">
        {getImageComponent(imageLinks, this.isImageShowing, this.props.type)}
        <div
          role="navigation"
          className="arrow arrow-left"
          style={{display: arrows ? 'initial' : 'none'}}
          onClick={() => this.updateShowingImage(-1)}
        >
          <SvgIcon className="icon-holder" icon={chevronLeft} size={20} />
        </div>

        <div
          role="navigation"
          className="arrow arrow-right"
          style={{display: arrows ? 'initial' : 'none'}}
          onClick={() => this.updateShowingImage(1)}
        >
          <SvgIcon className="icon-holder" icon={chevronRight} size={20} />
        </div>

        <div
          style={{display: dots ? 'initial' : 'none'}}
          className="dots-holder"
        >
          {imageLinks.map((link, index) => (
            <div
              role="navigation"
              key={index}
              className={`dot${currentShowingImageIndex === index ? ' selected' : ''}`}
              onClick={() => this.showImageAtIndex(index)}
            />
          ))}
        </div>

      </div>
    );
  }
}

const getImageComponent = (imageLinks, checkIfShowing, type) => (
  type === 'image' ?
    imageLinks.map((link, index) => (
      <img
        alt=""
        key={index}
        className={checkIfShowing(index) ? 'active' : 'inactive'}
        src={link}
      />))
    :
    imageLinks.map((link, index) => (
      <div
        style={{backgroundImage: `url('${link}')`}}
        key={index}
        className={`bg-image ${checkIfShowing(index) ? 'active' : 'inactive'}`}
      />))
);

ImageCarousal.propTypes = {
  imageLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
  viewDuration: PropTypes.number.isRequired,
  dots: PropTypes.bool,
  arrows: PropTypes.bool,
  type: PropTypes.oneOf(['image', 'bg-image'])
};

ImageCarousal.defaultProps = {
  dots: false,
  arrows: false,
  type: 'image'
};

export default ImageCarousal;

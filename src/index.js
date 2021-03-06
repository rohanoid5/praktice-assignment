import React, { Component, PropTypes, WheelEvent } from 'react';
import './style.less';

class PickerColumn extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    itemHeight: PropTypes.number.isRequired,
    columnHeight: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      ...this.computeTranslate(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isMoving) {
      return;
    }
    this.setState(this.computeTranslate(nextProps));
  }

  computeTranslate = (props) => {
    const { options, value, itemHeight, columnHeight } = props;
    let selectedIndex = options.indexOf(value);
    if (selectedIndex < 0) {
      // throw new ReferenceError();
      console.warn('Warning: "' + this.props.name + '" doesn\'t contain an option of "' + value + '".');
      this.onValueSelected(options[0]);
      selectedIndex = 0;
    }
    return {
      scrollerTranslate: columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * options.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

  onValueSelected = (newValue) => {
    this.props.onChange(this.props.name, newValue);
  };

  handleTouchStart = (event) => {
    const startTouchY = event.targetTouches[0].pageY;
    this.setState(({ scrollerTranslate }) => ({
      startTouchY,
      startScrollerTranslate: scrollerTranslate
    }));
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    const touchY = event.targetTouches[0].pageY;
    this.setState(({ isMoving, startTouchY, startScrollerTranslate, minTranslate, maxTranslate }) => {
      if (!isMoving) {
        return {
          isMoving: true
        }
      }

      let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
      if (nextScrollerTranslate < minTranslate) {
        nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8);
      } else if (nextScrollerTranslate > maxTranslate) {
        nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8);
      }
      return {
        scrollerTranslate: nextScrollerTranslate
      };
    });
  };

  handleTouchEnd = (event) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0
    });
    setTimeout(() => {
      this.postMove();
    }, 0);
  };

  handleTouchCancel = (event) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState((startScrollerTranslate) => ({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      scrollerTranslate: startScrollerTranslate
    }));
  };

  handleItemClick = (option) => {
    if (option !== this.props.value) {
      this.onValueSelected(option);
    }
  };

  postMove() {
    const { options, itemHeight } = this.props;
    const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
    let activeIndex;
    if (scrollerTranslate > maxTranslate) {
      activeIndex = 0;
    } else if (scrollerTranslate < minTranslate) {
      activeIndex = options.length - 1;
    } else {
      activeIndex = - Math.floor((scrollerTranslate - maxTranslate) / itemHeight);
    }
    this.onValueSelected(options[activeIndex]);
  }

  postWheel() {
    const that = this;
    setTimeout(() => {
      if (that.state.isScrolling > (Date.now() - 250)) {
        this.postWheel();
        return;
      }
      this.postMove();
    }, 250);
  }

  handleWheel = (event) => {

    const deltaY = event.deltaY;

    this.setState(({ scrollerTranslate, minTranslate, maxTranslate }) => {
      const newValue = (scrollerTranslate || 0) + Math.round(deltaY);
      const newTranslate = Math.max(minTranslate, Math.min(maxTranslate, (scrollerTranslate || 0) + Math.round(deltaY)));

      this.postWheel();

      return {
        scrollerTranslate: newTranslate,
        isScrolling: Date.now()
      };
    });
  };

  renderItems() {
    const { options, itemHeight, value, emptyCheck, needed, danger } = this.props;
    return options.map((option, index) => {
      const style = {
        height: itemHeight + 'px',
        lineHeight: itemHeight + 'px'
      };
      const className = `picker-item${option === value ? ' picker-item-selected' : ''}`;
      if(needed)  {
        if(emptyCheck !== undefined) {
          return (
            <div
              key={index}
              className={emptyCheck[index] ?
                `picker-item-crossed${option === value ? ' picker-item-selected-crossed' : ''}` :
                `picker-item${option === value ? ' picker-item-selected' : ''}`
              }
              style={style}
              onClick={() => this.handleItemClick(option)}>{option}</div>
          );
        }
      } else {
        if(value == "No slotes available") {
          return (
            <div
              key={index}
              className={
                `picker-item${option === value ? ' picker-item-selected-danger' : ''}`
              }
              style={style}
              onClick={() => this.handleItemClick(option)}>{option}</div>
          );
        } else {
          return (
            <div
              key={index}
              className={
                `picker-item${option === value ? ' picker-item-selected' : ''}`
              }
              style={style}
              onClick={() => this.handleItemClick(option)}>{option}</div>
          );
        }
      }
    });
  }

  render() {
    const translateString = `translate3d(0, ${this.state.scrollerTranslate}px, 0)`;
    const style = {
      MsTransform: translateString,
      MozTransform: translateString,
      OTransform: translateString,
      WebkitTransform: translateString,
      transform: translateString
    };
    if (this.state.isMoving) {
      style.transitionDuration = '0ms';
    }
    return (
      <div className="picker-column">
        <div
          className="picker-scroller"
          style={style}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
          onWheel={this.handleWheel}
        >
          {this.renderItems()}
        </div>
      </div>
    )
  }
}

export default class Picker extends Component {
  static propTyps = {
    optionGroups: PropTypes.object.isRequired,
    valueGroups: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    itemHeight: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = {
    itemHeight: 36,
    height: 216
  };

  renderInner() {
    const { optionGroups, valueGroups, itemHeight, height, onChange, emptyCheck, needed, danger } = this.props;
    const highlightStyle = {
      height: itemHeight,
      marginTop: -(itemHeight / 2)
    };
    let i = 0;
    const columnNodes = [];
    // if(emptyCheck !== undefined) console.log("sent " + emptyCheck[i]);
    for (let name in optionGroups) {
      columnNodes.push(
        <PickerColumn
          key={name}
          name={name}
          emptyCheck={emptyCheck}
          needed={needed}
          danger={true}
          options={optionGroups[name]}
          value={valueGroups[name]}
          itemHeight={itemHeight}
          columnHeight={height}
          onChange={onChange} />
      );
    }
    return (
      <div className="picker-inner" emptyCheck={emptyCheck}>
        {columnNodes}
        <div className="picker-highlight" style={highlightStyle}></div>
      </div>
    );
  }

  render() {
    const style = {
      height: this.props.height
    };

    return (
      <div className="picker-container" style={style}>
        {this.renderInner()}
      </div>
    );
  }
}

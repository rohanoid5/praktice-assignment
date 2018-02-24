import React, {Component, PropTypes} from 'react';
import Picker from 'react-mobile-picker';

var data = {
  "template_type": "slot_picker",
  "selection_color": "#000000",
  "secondary_color": "#808080",
  "title": "Available Slots for Dr. Sumit",
  "available_slots": [{
      "date": "Wed, Dec 06",
      "date_slots": []
    },
    {
      "date": "Thu, Dec 07",
      "date_slots": []
    },
    {
      "date": "Fri, Dec 08",
      "date_slots": []
    },
    {
      "date": "Sat, Dec 09",
      "date_slots": []
    },
    {
      "date": "Today",
      "date_slots": [{
          "hour": "8",
          "hour_slots": [{
              ":10 AM": "slotId001"
            },
            {
              ":50 AM": "slotId005"
            }
          ]
        },
        {
          "hour": "3",
          "hour_slots": [{
              ":00 PM": "slotId005"
            },
            {
              ":30 PM": "slotId007"
            }
          ]
        }
      ]
    },
    {
      "date": "Tomorrow",
      "date_slots": [

      ]
    },
    {
      "date": "Wed, Dec 13",
      "date_slots": [{
          "hour": "4",
          "hour_slots": [{
              ":30 PM": "slotId105"
            },
            {
              ":50 PM": "slotId106"
            }
          ]
        },
        {
          "hour": "5",
          "hour_slots": [{
              ":30 PM": "slotId202"
            },
            {
              ":45 PM": "slotId208"
            }
          ]
        }
      ]
    }
  ]
}

const dateArr = [];
const emptyCheck = [];

for(var i = 0; i < data.available_slots.length; i++) {
  dateArr.push(data.available_slots[i].date);
  if(data.available_slots[i].date_slots.length == 0) emptyCheck.push(true);
  else emptyCheck.push(false);
}

export default class NamePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueGroupsOne: {
        date: dateArr[0],
      },
      optionGroupsOne: {
        date: dateArr,
      },
      valueGroupsTwo: {
        hour: 'No slotes available',
      },
      optionGroupsTwo: {
        hour: ['No slotes available'],
      },
      valueGroupsThree: {
        slot: '',
        slotId: '',
      },
      optionGroupsThree: {
        slot: [''],
      },
      valueGroupsFour: {
        slotId: '',
      },
      optionGroupsFour: {
        slotId: [''],
      },
      selectedId: '',
      emptyCheck: emptyCheck
    };
  }

  handleChangeOne = (name, value) => {
    // console.log(value);
    let hourArr = [];
    let slotArr = [];
    let slotIdArr = [];
    for(var j = 0; j < data.available_slots[dateArr.indexOf(value)].date_slots.length; j++) {
      hourArr.push(data.available_slots[dateArr.indexOf(value)].date_slots[j].hour);
    }
    if(hourArr.length > 0) {
      for(var i = 0; i < data
        .available_slots[dateArr.indexOf(value)]
        .date_slots[0]
        .hour_slots.legth; i++) {
        slotArr.push(Object.keys(data
          .available_slots[dateArr.indexOf(value)]
          .date_slots[0]
          .hour_slots[i]));
      }
    }
    if(hourArr.length == 0) {
      hourArr.push('No slotes available');
      this.setState({danger: true, selectedId: ''})
    } else {
      this.setState({danger: false});
    }
    if(slotArr.length == 0) slotArr.push('');
    if(slotIdArr.length == 0) slotIdArr.push('');
    this.setState(({valueGroupsOne}) => ({
      valueGroupsOne: {
        ...valueGroupsOne,
        [name]: value
      }
    }));
    this.setState({
      optionGroupsTwo: {
        hour: hourArr,
      }
    });
    this.setState({
      optionGroupsThree: {
        slot: slotArr,
      },
    });
  };

  handleChangeTwo = (name, value) => {
    let slotArr = [];
    let slotIdArr = [];
    this.setState(({valueGroupsTwo}) => ({
      valueGroupsTwo: {
        ...valueGroupsTwo,
        [name]: value
      }
    }));
    var dVal = data
    .available_slots[dateArr.indexOf(this.state.valueGroupsOne.date)]
    .date_slots[this.state.optionGroupsTwo.hour.indexOf(value)];
    if(typeof dVal !== "undefined") {
      for(var i = 0; i < 2; i++) {
        var val = Object.keys(data
        .available_slots[dateArr.indexOf(this.state.valueGroupsOne.date)]
        .date_slots[this.state.optionGroupsTwo.hour.indexOf(value)]
        .hour_slots[i]);
        slotArr.push(val);
      }
    }
    if(slotArr.length == 0) slotArr.push('');
    this.setState({
      optionGroupsThree: {
        slot: slotArr,
      },
    });
  };

  handleChangeThree = (name, value) => {
    if(value === undefined) {
      // console.log('ABC')
    } else {
      this.setState(({valueGroupsThree}) => ({
        valueGroupsThree: {
          [name]: value
        }
      }));
      // console.log(this.state.valueGroupsOne.date);
      // console.log(this.state.valueGroupsTwo.hour);
      // console.log(this.state.valueGroupsThree.slot);
      let mArr = data
        .available_slots[
          dateArr.indexOf(this.state.valueGroupsOne.date)
        ].date_slots
      for(var i = 0; i < mArr.length; i++) {
        // console.log("comp " + value[0]);
        for(var j = 0; j < mArr[i].hour_slots.length; j++) {
          // console.log(Object.keys(mArr[i].hour_slots[j])[0]);
          if(Object.keys(mArr[i].hour_slots[j])[0] == value[0]) {
            console.log(Object.values(mArr[i].hour_slots[j])[0]);
            this.setState({
              selectedId: Object.values(mArr[i].hour_slots[j])[0]
            });
          }
        }
      }
    }
    // console.log(data
    //   .available_slots[dateArr.indexOf(this.state.valueGroupsOne.date)].date_slots);
    // console.log(this.state.valueGroupsTwo);
  }

  render() {
    const {
      optionGroupsOne,
      valueGroupsOne,
      optionGroupsTwo,
      valueGroupsTwo,
      optionGroupsThree,
      valueGroupsThree,
      selectedId
    } = this.state;

    return (
      <div>
        <div className="weui_cells">
          <div className="weui_cell">
            <div className="weui_cell_bd weui_cell_primary">
              {valueGroupsOne.date}, {valueGroupsTwo.hour}{valueGroupsThree.slot} {selectedId}
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <Picker
            emptyCheck={this.state.emptyCheck}
            needed={true}
            danger={false}
            optionGroups={this.state.optionGroupsOne}
            valueGroups={this.state.valueGroupsOne}
            onChange={this.handleChangeOne} />
          <Picker
            needed={false}
            danger={this.state.danger}
            optionGroups={this.state.optionGroupsTwo}
            valueGroups={this.state.valueGroupsTwo}
            onChange={this.handleChangeTwo} />
          <Picker
            needed={false}
            optionGroups={this.state.optionGroupsThree}
            valueGroups={this.state.valueGroupsThree}
            onChange={this.handleChangeThree} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <a className="btn btn-transparent" type="submit" onClick={() => {
            if(this.state.valueGroupsTwo.hour == 'No slotes available') {
              alert("Sorry no slotes available at this date.");
            }
            else {
              alert("Your selected date is: " + valueGroupsOne.date +", "+ valueGroupsTwo.hour +""+ valueGroupsThree.slot +
              "\nand your selected id is " + this.state.selectedId
              );
            }
          }}
          className="btn">Submit</a>
        </div>
      </div>
    );
  }
}

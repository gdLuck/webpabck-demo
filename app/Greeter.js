import React, {Component} from 'react'
import config from './config.json';
import styles from './Greeter.css';//导入

class Greeter extends Component{
  render() {
    return (
      <div className={styles.root}>
        {config.greetText}
        <div>
          {__dirname}
        </div>
      </div>
    );
  }
}

export default Greeter
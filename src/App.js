import { Component } from 'react';
import Formula from './components/Formula';
import Display from './components/Display';
import Button from './components/Button';

const isOperator = /[x/+‑]/;
const endsWithOperator = /[x+‑/]$/;
const endsWithNegativeSign = /\d[x/+‑]{1}‑$/;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentVal: '0',
      prevVal: '0',
      formula: '',
      evaluated: false
    };
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  maxDigitWarning() {
    this.setState({
      currentVal: 'Digit Limit Met',
      prevVal: this.state.currentVal
    });
    setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
  }

  handleEvaluate() {
    if (!this.state.currentVal.includes('Limit')) {
      let expression = this.state.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression
        .replace(/x/g, '*')
        .replace(/‑/g, '-')
        .replace('--', '+0+0+0+0+0+0+');
      // eslint-disable-next-line no-eval
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula:
          expression
            .replace(/\*/g, '⋅')
            .replace(/-/g, '‑')
            .replace('+0+0+0+0+0+0+', '‑-')
            .replace(/(x|\/|\+)‑/, '$1-')
            .replace(/^‑/, '-') +
          '=' +
          answer,
        prevVal: answer,
        evaluated: true
      });
    }
  }

  handleOperators(e) {
    if (!this.state.currentVal.includes('Limit')) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentVal: value, evaluated: false });
      if (evaluated) {
        this.setState({ formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({  prevVal: formula, formula: formula + value });
      } else if (!endsWithNegativeSign.test(formula)) {
        this.setState({ formula: (endsWithNegativeSign.test(formula + value) ? formula : prevVal) + value });
      } else if (value !== '‑') {
        this.setState({ formula: prevVal + value });
      }
    }
  }

  handleNumbers(e) {
    if (!this.state.currentVal.includes('Limit')) {
      const value = e.target.value;
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 16) {
        this.maxDigitWarning();
      } else if (this.state.evaluated) {
        this.setState({ currentVal: value, formula: value !== '0' ? value : '' });
      } else {
        this.setState({
          currentVal:
            this.state.currentVal === '0' || isOperator.test(this.state.currentVal)
              ? value
              : this.state.currentVal + value,
          formula:
            this.state.currentVal === '0' && value === '0'
              ? this.state.formula === ''
                ? value
                : this.state.formula
              : /([^.0-9]0|^0)$/.test(this.state.formula)
              ? this.state.formula.slice(0, -1) + value
              : this.state.formula + value
        });
      }
    }
  }

  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({ currentVal: '0.', formula: '0.', evaluated: false });
    } else if (!this.state.currentVal.includes('.') && !this.state.currentVal.includes('Limit')) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 16) {
        this.maxDigitWarning();
      } else if (endsWithOperator.test(this.state.formula) || (this.state.currentVal === '0' && this.state.formula === '')) {
        this.setState({ currentVal: '0.', formula: this.state.formula + '0.' });
      } else {
        this.setState({ currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + '.', formula: this.state.formula + '.' });
      }
    }
  }

  initialize () {
    this.setState({
      currentVal: '0',
      prevVal: '0',
      formula: '',
      evaluated: false
    });
  }

  render () {

    const { formula, currentVal} = this.state;

    return (
      <div className="container-fluid">
       <div className="card calculator-container">
         <Formula formula={formula.replace(/x/g, '⋅')} />
         <Display currentVal={currentVal} />
         <div className="button-grid">
           <Button initialize={this.initialize} handleOperators={this.handleOperators} handleNumbers={this.handleNumbers} handleEvaluate={this.handleEvaluate} handleDecimal={this.handleDecimal} />
         </div>
       </div>
     </div>
    );
  }

}

export default App;

import { useState } from 'react';
import Formula from './components/Formula';
import Display from './components/Display';
import Button from './components/Button';

const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/,
  endsWithNegativeSign = /\d[x/+‑]{1}‑$/;

function App() {

  const [result, setResult] = useState({
    currentVal: '0',
    prevVal: '0',
    formula: '',
    evaluated: false
  });

  const maxDigitWarning = () => {
    setResult({
      ...result,
      currentVal: 'Digit Limit Met',
      prevVal: result.currentVal
    });
    setTimeout(() => setResult({ ...result, currentVal: result.prevVal }), 1000);
  };

  const handleEvaluate = () => {
    if (!result.currentVal.includes('Limit')) {
      let expression = result.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression
        .replace(/x/g, '*')
        .replace(/‑/g, '-')
        .replace('--', '+0+0+0+0+0+0+');
      // eslint-disable-next-line no-eval
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      setResult({
        ...result,
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

  const handleOperators = (e) => {
    if (!result.currentVal.includes('Limit')) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = result;
      setResult({ ...result, currentVal: value, evaluated: false });
      if (evaluated) {
        setResult({ ...result, formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        setResult({
          ...result,
          prevVal: formula,
          formula: formula + value
        });
      } else if (!endsWithNegativeSign.test(formula)) {
        setResult({
          ...result,
          formula: (endsWithNegativeSign.test(formula + value) ? formula : prevVal) + value
        });
      } else if (value !== '‑') {
        setResult({
          ...result,
          formula: prevVal + value
        });
      }
    }
  };

  const handleNumbers = (e) => {
    if (!result.currentVal.includes('Limit')) {
      const value = e.target.value;
      setResult({ ...result, evaluated: false });
      if (result.currentVal.length > 16) {
        maxDigitWarning();
      } else if (result.evaluated) {
        setResult({
          ...result,
          currentVal: value,
          formula: value !== '0' ? value : ''
        });
      } else {
        setResult({
          ...result,
          currentVal:
            result.currentVal === '0' || isOperator.test(result.currentVal)
              ? value
              : result.currentVal + value,
          formula:
            result.currentVal === '0' && value === '0'
              ? result.formula === ''
                ? value
                : result.formula
              : /([^.0-9]0|^0)$/.test(result.formula)
              ? result.formula.slice(0, -1) + value
              : result.formula + value
        });
      }
    }
  };

  const handleDecimal = () => {
    if (result.evaluated === true) {
      setResult({
        ...result,
        currentVal: '0.',
        formula: '0.',
        evaluated: false
      });
    } else if (!result.currentVal.includes('.') && !result.currentVal.includes('Limit')) {
      setResult({ ...result, evaluated: false });
      if (result.currentVal.length > 16) {
        maxDigitWarning();
      } else if (endsWithOperator.test(result.formula) || (result.currentVal === '0' && result.formula === '')) {
        setResult({
          ...result,
          currentVal: '0.',
          formula: result.formula + '0.'
        });
      } else {
        setResult({
          ...result,
          currentVal: result.formula.match(/(-?\d+\.?\d*)$/)[0] + '.',
          formula: result.formula + '.'
        });
      }
    }
  };

  const initialize = () => {
    setResult({
      ...result,
      currentVal: '0',
      prevVal: '0',
      formula: '',
      evaluated: false
    });
  };

  return (
    <div className="container-fluid">
      <div className="card calculator-container">
        <Formula formula={result.formula.replace(/x/g, '⋅')} />
        <Display currentVal={result.currentVal} />
        <div className="button-grid">
          <Button initialize={initialize} handleOperators={handleOperators} handleNumbers={handleNumbers} handleEvaluate={handleEvaluate} handleDecimal={handleDecimal} />
        </div>
      </div>
    </div>
  );
}

export default App;

const Button = ({ initialize, handleOperators, handleNumbers, handleEvaluate, handleDecimal }) => {
    return (
        <>
            <button value="AC" id="clear" onClick={initialize}>AC</button>
            <button value="/" id="divide" onClick={handleOperators}>/</button>
            <button value="x" id="multiply" onClick={handleOperators}>x</button>
            <button value="7" id="seven" onClick={handleNumbers}>7</button>
            <button value="8" id="eight" onClick={handleNumbers}>8</button>
            <button value="9" id="nine" onClick={handleNumbers}>9</button>
            <button value="‑" id="subtract" onClick={handleOperators}>‑</button>
            <button value="4" id="four" onClick={handleNumbers}>4</button>
            <button value="5" id="five" onClick={handleNumbers}>5</button>
            <button value="6" id="six" onClick={handleNumbers}>6</button>
            <button value="+" id="add" onClick={handleOperators}>+</button>
            <button value="1" id="one" onClick={handleNumbers}>1</button>
            <button value="2" id="two" onClick={handleNumbers}>2</button>
            <button value="3" id="three" onClick={handleNumbers}>3</button>
            <button value="=" id="equals" onClick={handleEvaluate}>=</button>
            <button value="0" id="zero" onClick={handleNumbers}>0</button>
            <button value="." id="decimal" onClick={handleDecimal}>.</button>
        </>
    );
};

export default Button;

const INVALID_EXPRESSION = "Invalid Expression";

const Screen = props => {
  return (
    <div className="calculator-output">
      <input
        type="text"
        className="calculator-user-input"
        value={props.equation}
        disabled
      />
      {props.error === INVALID_EXPRESSION
        ? <div className="calculator-error">
            {props.error}
          </div>
        : <input
            type="text"
            className="calculator-answer"
            value={props.answer}
            disabled
          />}
    </div>
  );
};

const Button = props => {
  return (
    <button type="button" id={props.id} onClick={props.click}>
      {props.value}
    </button>
  );
};

const ButtonGroup = ({ click, buttons = [] }) => {
  let btns = buttons.map(value =>
    <Button value={value} id={value} key={value} click={() => click(value)} />
  );
  return (
    <div>
      {btns}
    </div>
  );
};

const Body = props => {
  const buttons = [7, 8, 9, 4, 5, 6, 1, 2, 3, ".", 0, "="];
  const operators = ["C", "DEL", "/", "*", "-", "+"];

  return (
    <div className="calculator-body">
      <div className="calculator-side-menu">
        <ButtonGroup buttons={operators} click={props.click} />
      </div>
      <div className="calculator-main">
        <ButtonGroup buttons={buttons} click={props.click} />
      </div>
    </div>
  );
};

const Footer = (props) => {
  return (
    <footer>
		{/* <a href="http://codepen.io/evonzz/#" target="_blank" rel="noopener noreferrer">By Evans</a> */}
	</footer>
  );
};

const operators = ["+", "/", "-", "*"];
const hasItem = (arr, item) => arr.indexOf(item) !== -1;

const CalculatorReducer = (state, value) => {
  let eqArr = state.equation.split("");
  let lastItem = eqArr[eqArr.length - 1];

  // The value is a number, return the number
  if (!isNaN(value)) {
    return {
      ...state,
      equation: state.equation + value,
      value
    };
  }

  // Dot operator is first to be selected
  if (isNaN(value) && state.equation.length < 1 && value === ".") {
    return {
      ...state,
      equation: "0.",
      value
    };
  }

  // Dot operator is selected
  if (state.equation.length >= 1 && value === ".") {
    // If the last operator selected is the dot operator - do nothing
    if (lastItem === ".") {
      return {
        ...state
      };
    }
    return {
      ...state,
      equation: state.equation + ".",
      value
    };
  }

  // Clear "C" operator is selected
  if (value === "C") {
    return {
      ...state,
      equation: "",
      answer: "",
      error: "",
      value
    };
  }

  // DEL operator is selected
  if (value === "DEL" && state.equation.length >= 1) {
    return {
      ...state,
      equation: state.equation.slice(0, -1),
      value
    };
  }

  // Math operator is selected
  if (hasItem(operators, value) && state.equation.length >= 1) {
    if (isNaN(lastItem)) {
      let eq = state.equation;
      return {
        ...state,
        equation: eq.substring(0, eq.length - 1) + value
      };
    }
    return {
      ...state,
      equation: state.equation + value,
      value
    };
  }

  // Equal operator is selected
  if (value === "=" && state.equation.length >= 1) {
    let answer = "";
    let error = "";
    try {
        // eslint-disable-next-line
        answer = eval(state.equation)
    } catch (err) {
        error = INVALID_EXPRESSION;
    }
    
    return {
      ...state,
      answer,
      error
    };
  }

  return {
    ...state,
    value
  };
};

class Calculator extends React.Component {
  state = {
    equation: "",
    answer: "",
    value: 0,
    error: ""
  };

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(value) {
    this.setState(() => {
      return CalculatorReducer(this.state, value);
    });
  }

  render() {
    return (
      <div>
        <div className="calculator">
          <Screen equation={this.state.equation} answer={this.state.answer} error={this.state.error}/>
          <Body click={this.handleClick}/>
        </div>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById('root'));
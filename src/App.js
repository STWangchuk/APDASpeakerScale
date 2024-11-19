import React, { useState } from "react";
import "./App.css";

// Speaker Scale Data
const speakerScale = [
  {
    category: "",
    minScore: 36,
    maxScore: 38,
    description:
      "Speaker’s role fulfillment is nearly flawless (eg, most of the speech’s responses are complete and decisive, or its weighing strategically positions that team’s material to win the round even in the context of strong competing weighing).\nArguments do not have flaws of any significance (although very minor flaws will of course still exist), and demand extremely sophisticated responses to defeat them.",
  },
  {
    category: "",
    minScore: 33,
    maxScore: 35,
    description:
      "Speaker’s role fulfillment is complete, with very minor flaws (eg, speech fully responds to good arguments but may not fully respond to extremely nuanced arguments, or its weighing may be strong but not fully decisive in the context of strong competing weighing).\n Arguments have strong explanations, which demand strong responses from other speakers in order to defeat them. ",
  },
  {
    category: "",
    minScore: 30,
    maxScore: 32,
    description:
      "Speaker mostly fulfills their role, with some minor flaws (eg, speech may have some strong responses but some which are lacking nuance, or weighing may be strong but might occasionally be unstrategic and fail to beat good competing weighing).\nArguments are well-made without obvious logical gaps, and are well-explained. However, they may be vulnerable to good responses.",
  },
  {
    category: "",
    minScore: 27,
    maxScore: 29,
    description:
      "Speaker fulfills their role, but there are some flaws in its role fulfillment (eg, speech has solid engagement but might fail to respond to a key argument, or it may lack comparative weighing despite some evidence of good strategic choices with regards to what to weigh).\nOccasionally, but not often, arguments may slip into deficits in explanation, simplistic argumentation vulnerable to competent responses, or irrelevant arguments. ",
  },
  {
    category: "",
    minScore: 24,
    maxScore: 26,
    description:
      "Speaker fulfills their role to some extent, but has some noticeable flaws in doing so (eg, speech may often have superficial or incomplete responses, or its weighing may often be assertive, though may have some occasional moments of doing solid role fulfillment).\nArguments are logical, but tend to be simplistic and vulnerable to competent responses. They may also be partially off-clash.",
  },
  {
    category: "",
    minScore: 21,
    maxScore: 23,
    description:
      "Speaker attempts to fulfill their role, with glaring flaws in its attempt to do so (eg, speech fails to engage with even weaker arguments, and its weighing is mostly assertive).\nArguments have some explanation, but there are regular significant logical gaps. Arguments are also frequently off-clash. ",
  },
  {
    category: "",
    minScore: 18,
    maxScore: 20,
    description:
      "Speaker barely fulfills their role (eg, speech comments on the round but does not attempt to engage with other speakers, or has only occasional moments in which it attempts to weigh).\n Claims are formulated as arguments, but are confusing and often irrelevant. ",
  },
  {
    category: "",
    minScore: 15,
    maxScore: 17,
    description:
      "Speaker does not fulfill their role or demonstrate any attempt to do so (eg, speech may drop the other team’s entire case, or does not weigh at all). \nSpeech fills little of its time, may make tone-deaf arguments, or delivers almost exclusively irrelevant comments. ",
  },
];

// Helper function to ensure the score is within the valid bounds
const ensureValidScore = (score) => {
    if (score < 15) return 15;
    if (score > 38) return 38;
    return score;
  };
  
  function App() {
    const [currentBracket, setCurrentBracket] = useState(null);
    const [validBrackets, setValidBrackets] = useState([...speakerScale]);
    const [rangeQuestion, setRangeQuestion] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [gameOver, setGameOver] = useState(false);
  
    // Select a random bracket within validBrackets
    const pickRandomBracket = (brackets) => {
      const randomIndex = Math.floor(Math.random() * brackets.length);
      return brackets[randomIndex];
    };
  
    // Start or randomize a new bracket
    const randomizeCategory = () => {
      const newBracket = pickRandomBracket(validBrackets);
      setCurrentBracket(newBracket);
      setShowScore(false);
      setRangeQuestion(false);
      setFinalScore(null);
      setGameOver(false);
    };
  
    // Handle "Better" or "Worse" selection
    const handleBetterWorse = (response) => {
      if (!currentBracket) return;
      const { minScore, maxScore } = currentBracket;
  
      let filteredBrackets = [];
      if (response === "better") {
        // If we're in the highest range and user chooses "Better", assign final score of 38
        if (maxScore === 38) {
          setFinalScore(38);
          setGameOver(true);
          return;
        }
        filteredBrackets = validBrackets.filter(
          (bracket) => bracket.minScore > maxScore
        );
        if (filteredBrackets.length === 0) {
          setFinalScore(maxScore + 1);
        }
      } else if (response === "worse") {
        // If we're in the lowest range and user chooses "Worse", assign final score of 15
        if (minScore === 15) {
          setFinalScore(15);
          setGameOver(true);
          return;
        }
        filteredBrackets = validBrackets.filter(
          (bracket) => bracket.maxScore < minScore
        );
        if (filteredBrackets.length === 0) {
          setFinalScore(minScore - 1);
        }
      }
  
      if (filteredBrackets.length === 0) {
        setValidBrackets([...speakerScale]);
        randomizeCategory();
      } else {
        setValidBrackets(filteredBrackets);
        randomizeCategory();
      }
    };
  
    // Handle "Match" selection (reveal score)
    const handleMatch = () => {
      setShowScore(true);  // Reveal the full score range when "Match" is clicked
    };
  
    // Final range selection (High, Mid, Low)
    const handleFinalSelection = (choice) => {
      const { minScore, maxScore } = currentBracket;
      const midScore = Math.floor((minScore + maxScore) / 2);
  
      let finalScore = midScore;
      if (choice === "high") finalScore = ensureValidScore(maxScore);
      if (choice === "low") finalScore = ensureValidScore(minScore);
  
      setFinalScore(finalScore);
      setGameOver(true);
    };
  
    // Reset game state
    const resetGame = () => {
      setValidBrackets([...speakerScale]);
      setCurrentBracket(null);
      setShowScore(false);
      setRangeQuestion(false);
      setFinalScore(null);
      setGameOver(false);
    };
  
    // Start with a random category if none is set
    if (!currentBracket) {
      randomizeCategory();
    }
  
    return (
      <div className="App">
        <header className="App-header">
          <h1>APDA Speaker Scale</h1>
          {currentBracket && !gameOver && (
            <div>
              <h3>{currentBracket.description}</h3>
            </div>
          )}
  
          {gameOver && finalScore !== null && (
            <div className="final-score">
              <h2>Your Speaker Score is: {finalScore}</h2>
              <button onClick={resetGame}>Restart</button>
            </div>
          )}
  
          {rangeQuestion && currentBracket && !gameOver && (
            <div>
              <p>Choose between:</p>
              <button onClick={() => setRangeQuestion(false)}>Lower Range</button>
              <button onClick={() => setRangeQuestion(false)}>Higher Range</button>
            </div>
          )}
  
          {!rangeQuestion && !gameOver && (
            <div className="controls">
              <div className="top-row">
                <button onClick={() => handleBetterWorse("worse")}>Worse</button>
                <button onClick={() => handleBetterWorse("better")}>Better</button>
              </div>
              <button onClick={handleMatch}>Match</button>
            </div>
          )}
  
          {showScore && currentBracket && !gameOver && (
            <div>
              <p>Is it the High, Mid, or Low end?</p>
              <button onClick={() => handleFinalSelection("low")}>Low</button>
              <button onClick={() => handleFinalSelection("mid")}>Mid</button>
              <button onClick={() => handleFinalSelection("high")}>High</button>

            </div>
          )}
        </header>
        <div className="credits">
        <p>Based off Matt Mauriello's <a href="https://docs.google.com/document/d/1yptW79G1oL9mNDhCPcuZf0zwibPtz05-Xg6qjGjC9FU/edit?usp=sharing">APDA Speaker Scale</a>.</p>
        <p>And inspired by Tom Kuson's BP speaker point allocator</p>
        </div>
      </div>
      
    );
  }
  
  export default App;

const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const { lowEnergyWords, negationWords, negationPhrases } = require("./words");

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

const getValence = (text) => {
  const result = sentiment.analyze(text);

  const normalized = sigmoid(result.score);
  // console.log(result);
  console.log("NORMALIZED VALENCE: ", normalized.toFixed(3));
  return normalized;
};

const getEnergy = (text) => {
  let energyScore = 0;

  const exclamationCount = (text.match(/!/g) || []).length;
  energyScore += exclamationCount * 0.225;

  const allCapsCount = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  console.log("CAPS COUNT: ", allCapsCount);
  energyScore += allCapsCount * 0.325;

  const textLength = text.split(" ").length;
  console.log("TEXT LENGTH: ", textLength);
  const incrementMultipler = 0.015;
  for (let i = 2; i <= 500; i += 2) {
    if (textLength > i && textLength <= i + 2) {
      energyScore += incrementMultipler * (i / 2);
    }
  }

  lowEnergyWords.forEach((word) => {
    // const wordCount = (text.match(new RegExp("\\b" + word + "\\b", "gi")) || [])
    //   .length;
    // energyScore -= wordCount * 0.35;
    const regex = new RegExp("\\b" + word + "\\b", "gi");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const wordStartPosition = match.index;

      const substringBeforeWord = text.substring(0, wordStartPosition).trim();

      const lastWord = substringBeforeWord.split(/\s+/).pop();

      const hasNegationPhrase = negationPhrases.some((phrase) =>
        substringBeforeWord.endsWith(phrase)
      );

      if (
        !hasNegationPhrase &&
        !negationWords.includes(lastWord.toLowerCase())
      ) {
        energyScore -= 0.35;
      }
    }
  });

  const punctuationsCount = (text.match(/[;,.?()&/]/g) || []).length;
  console.log("PUNCTUATIONS COUNT: ", punctuationsCount);
  energyScore += punctuationsCount * 0.05;

  const normalizedEnergy = Math.round(sigmoid(energyScore) * 100) / 100;
  console.log("NORMALIZED ENERGRY: ", normalizedEnergy.toFixed(3));
  return normalizedEnergy;
};

const text = "I am TIRED HAHA!!";
getEnergy(text);
getValence(text);

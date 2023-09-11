const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const { lowEnergyWords, negationWords, negationPhrases } = require("./words");

function normalize(z) {
  return 1 / (1 + Math.exp(-z));
}

export const getValence = (text) => {
  const result = sentiment.analyze(text);

  const normalized = normalize(result.score);
  // console.log(result);
  console.log("NORMALIZED VALENCE: ", normalized.toFixed(3));
  return normalized;
};

export const getEnergy = (text) => {
  let energyScore = 0;

  const exclamationCount = (text.match(/!/g) || []).length;
  energyScore += exclamationCount * 0.225;

  const allCapsWords = text.match(/\b[A-Z]{3,}\b/g) || [];
  let positiveCapsCount = 0;
  let negativeCapsCount = 0;

  allCapsWords.forEach((word) => {
    if (lowEnergyWords.includes(word.toLowerCase())) {
      negativeCapsCount++;
    } else {
      positiveCapsCount++;
    }
  });
  energyScore -= negativeCapsCount * 0.325;
  energyScore += positiveCapsCount * 0.325;

  console.log("POSITIVE CAPS COUNT: ", positiveCapsCount);
  console.log("NEGATIVE CAPS COUNT: ", negativeCapsCount);

  const textLength = text.split(" ").length;
  console.log("TEXT LENGTH: ", textLength);

  const incrementMultiplier = 0.005;
  const increments = textLength / 2;
  energyScore += incrementMultiplier * increments;

  lowEnergyWords.forEach((word) => {
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

  const normalizedEnergy = Math.round(normalize(energyScore) * 100) / 100;
  console.log("NORMALIZED ENERGRY: ", normalizedEnergy.toFixed(3));
  return normalizedEnergy;
};

const text = "";
getEnergy(text);
getValence(text);

const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

const getValence = (text) => {
  const result = sentiment.analyze(text);

  const normalized = sigmoid(result.score);
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
  if (textLength > 50 && textLength < 149) {
    energyScore += 0.125;
  }
  if (textLength > 149 && textLength < 299) {
    energyScore += 0.225;
  }
  if (textLength > 300) {
    energyScore += 0.325;
  }

  const punctuationsCount = (text.match(/[;,.?()&/]/g) || []).length;
  console.log("PUNCTUATIONS COUNT: ", punctuationsCount);
  energyScore += punctuationsCount * 0.05;

  const normalizedEnergy = Math.round(sigmoid(energyScore) * 100) / 100;
  console.log("NORMALIZED ENERGRY: ", normalizedEnergy.toFixed(3));
  return normalizedEnergy;
};

const text = "I feel very MOTIVATED!;,.?()&/";

getEnergy(text);
getValence(text);

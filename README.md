
<h1 align="center"> <img src="https://github.com/abramfelix1/HeartBeats/assets/62622410/cf5fbca8-f858-475c-bd4a-453f20434c38" alt="image description" height="135"></h1>

[HeartBeats](https://HeartBeats-ajr.onrender.com/), a capstone project developed by Abram Felix for App Academy, offers users to explore music tailored to their emotions and effortlessly craft mood-centric playlists."

![Screenshot_24](https://github.com/abramfelix1/HeartBeats/assets/62622410/3bad4c58-3a2b-47b7-8382-18caa37a77bb)



## Technologies Used
HeartBeats was built using the following technologies:

### Backend:
- **JAVASCRIPT**
- **EXPRESS**
- **SEQUELIZE**

### Frontend:
- **JavaScript**
- **React**
- **Redux**
- **TailwindCSS**

### Others:
- **SENTIMENT**: Sentiment analysis based on AFINN's list of words
- **SPOTIFY API**

## Table of Contents
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Backend Setup: Express](#backend-setup-Express)
  - [Frontend Setup: React](#frontend-setup-react)
- [Operating](#operating)
- [HeartBeats Showcase!](#HeartBeats-showcase)
- [Wiki Documents](#wiki-documents)
- [Future Features](#future-features)
- [Technical Implementation Details](#technical-implementation-details)
- [Author](#author)

## Installation

### Backend Setup: Express

1. **Clone the Repository**
    ```bash
    git clone https://github.com/abramfelix1/HeartBeats.git
    ```

1. **Navigate to the Backend Folder**
    ```bash
    cd backend
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Configure Environment Settings**
    - Create a `.env` file using the provided example, adjusting settings suitable for your development environment.
    - Ensure the SQLite3 database connection URL is present in the `.env` file.
    - Set a unique name for the `SCHEMA` environment variable, using the `snake_case` convention.


### Frontend Setup: React

1. **Navigate to the React App Folder**
    ```bash
    cd frontend
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. With both backend and frontend running, you're ready to experience HeartBeats!

## Operating

For subsequent sessions, ensure you have two terminal windows:

1. **Backend Server** (ensure the database is migrated and seeded as mentioned in the installation process)
    ```bash
    npm start
    ```

2. **Frontend Server**
    ```bash
    npm start
    ```

Enjoy HeartBeats!

## HeartBeats Showcase!
![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzFzaGVtMWtwcHE3dmtlYmtjeG9uMHJ3YTI4NnczajQwd2doNTM4ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8Vsz1vmhK3Cay9o747/giphy.gif)
![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHltMTlhcnJsZ3RmeXp5cDQ0OWtrcnBuMW9xMXJ4ZTB1aDR2cGFpZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xF4pWbt2x0QR56UPBS/giphy.gif)


## [Wiki Documents](https://github.com/abramfelix1/HeartBeats/wiki)
- [Database Schema](https://github.com/abramfelix1/HeartBeats/wiki/Database-Schema)
- [Features](https://github.com/abramfelix1/HeartBeats/wiki/Feature-List)
- [Backend Routes](https://github.com/abramfelix1/HeartBeats/wiki/Backend-Routes)
- [User Stories](https://github.com/abramfelix1/HeartBeats/wiki/User-Stories)


## Future Features

### More Spotify Utilization:
- **Spotify Web Player**: Enable Spotify Web Player for verified Spotify users to play full songs and playlists
- **Importing Playlists**: Allow users to import their created playlists to Spotify


### Technical Implementations:
- **Energy Analysis**: For analyzing a journal entry's energy values, based on Sentiments valence analyzer

## Technical Implementation Details


### Abram - (Redux State & Sockets)
While researching ways to determine the valence values from text, I stumbled upon a library named "Sentiment." This library gauges valence by comparing text against a rated word list. Inspired by this, I developed my own equivalent for measuring "Energy." My energy definition incorporates factors like capitalizations, text length, punctuation, adjectives, and specific keywords. Each factor has its associated positive and negative multipliers. Since Spotify's API requires a value range of 0 to 1, I standardized the valence values from "Sentiment" and my energy analyzer's results. This process entailed extensive tweaking of multipliers across diverse text samples to achieve finely-tuned energy values.

function normalize(z) {
  return 1 / (1 + Math.exp(-z));
}

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
  energyScore += punctuationsCount * 0.05;

  const normalizedEnergy = Math.round(normalize(energyScore) * 100) / 100;
  return normalizedEnergy;
};
```

## Author
* Abram's [Github](https://github.com/abramfelix1) and [LinkedIn](https://www.linkedin.com/in/abram-felix-98937b162/)


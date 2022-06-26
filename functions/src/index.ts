import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
firebaseAdmin.initializeApp();

export const getSimilarSongs =
  functions.https.onRequest((request, response) => {
    const minSimilarityScore = request.body.minSimilarityScore;
    const songId = request.body.songId;
    const dbRef = firebaseAdmin.database().ref();
    type Result = {
      [key: string]: any;
    };
    const result: Result = {};
    dbRef.once("value")
        .then(function(snapshot) {
          for (let index = 0; index < snapshot.numChildren(); index++) {
            if (index != songId) {
              console.log("index " + index);
              const similaritiScore =
              snapshot.val()[songId]["similarityScores"][index];
              if (similaritiScore >= minSimilarityScore) {
                console.log(index);
                console.log(similaritiScore);
                const indexString = index.toString();
                result[indexString] =
              {
                "title": snapshot.val()[index]["title"],
                "similarityScore": similaritiScore,
              };
              }
            }
          }
          console.log("result: " + result);
          response.send(result);
        });
  });

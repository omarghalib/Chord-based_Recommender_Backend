import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
firebaseAdmin.initializeApp();

export const getSongRecommendations =
  functions.https.onCall((data, context) => {
    const numOfSongs = data.numOfSongs;
    const minSimilarityScore = data.minSimilarityScore;
    const songId = data.songId;
    console.log("songId " + songId);
    return new Promise((resolve, reject) => {
      firebaseAdmin.database().ref()
          .child(songId).
          child("similarityScores").
          orderByChild("score").
          startAt(minSimilarityScore).
          limitToLast(numOfSongs).
          once("value", function(snapshot) {
            const result = snapshot.val();
            if (result) {
              console.log(result)
              return resolve(result);
            } else {
              reject(new Error("result not found")
              );
            }
          })
          .catch(reject);
    });
  });

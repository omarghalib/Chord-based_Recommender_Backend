import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
firebaseAdmin.initializeApp();

export const getSimilarSongs =
  functions.https.onRequest(async (request, response) => {
    const numOfSongs = request.body.numOfSongs;
    const minSimilarityScore = request.body.minSimilarityScore;
    const songId = request.body.songId;
    const dbRef = firebaseAdmin.database().ref();
    type Result = {
      [key: string]: any;
    };
    const result: Result = {};
    await dbRef.child(songId.toString()).
        child("similarityScores").
        orderByChild("score").
        startAt(minSimilarityScore).
        limitToLast(numOfSongs).
        on("value", function(snapshot) {
        // snapshot would have list of NODES that satisfies the condition
        // console.log(snapshot.val());
          console.log("-----------");

          // go through each item found and print out the emails
          snapshot.forEach(function(childSnapshot) {
            const childData = childSnapshot.val();
            // this will be the actual email value found
            console.log(childData.score);
            console.log(childData.songId);
          });
          result[songId.toString()] = snapshot.val();
          response.send(result);
        });
    // await dbRef.child(songId.toString()).
    //   child("similarityScores").
    //   orderByValue().
    //   startAt(minSimilarityScore).
    //   on("value", async (snapshot) => {
    //     const resultId = snapshot.val();
    //     if (resultId != null) {
    //       console.log("resultId " + resultId);
    //       const title = await dbRef.
    //         child(resultId.toString()).
    //         child("title").once("value")
    //         .then(function (resultSnapshot) {
    //           console.log("title in the snapshot " + resultSnapshot.val());
    //           return resultSnapshot.val();
    //         });
    //       const similarityScore = await snapshot.val();
    //       console.log(snapshot.key);
    //       console.log(title);
    //       console.log(similarityScore);
    //       result[songId.toString()] =
    //       {
    //         "title": await title,
    //         "similarityScore": await similarityScore,
    //       };
    //     }
    //   });
  });

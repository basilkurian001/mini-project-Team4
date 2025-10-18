const API_URL = 'http://192.168.1.2/mini-project-Team4-master/backend/score_handler.php';

async function uploadScore(gameName,score=0) {
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                action: "upload_highscore",
                score: score,
                gameName: gameName
            }),
            credentials: "include" //includes session cookie
        });

        const result = await response.json();

        if (result.success){
            if(result.message){
                console.log("Scores updation successful! - "+result.message);
            }
            else{
                console.log("Scores updation successful!");
            }
        } else if (result.error) {
            console.log(result.error);
        }

    }catch (err) {
                console.log("Failed to send score to server: "+err);
            }
}
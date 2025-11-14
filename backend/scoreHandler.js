const API_URL = 'http://10.57.207.31/gamehub/backend/score_handler.php';

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

async function loadLeaderboard(gameName) {
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                action: "fetch_leaderboard",
                gameName: gameName
            }),
        });
        const result = await response.json();
        //const text = await response.text();
        //console.log("Raw response:", text);

        //console.log(result.data.username+" "+result.data.gameName);

        if(result.status=="success"){
            const leaderboardList = document.getElementById("leaderboardlist");
            result.data.forEach(player => {
            const li = document.createElement("li");
            li.textContent = `${player.user_name} - ${player[gameName]}`;
            leaderboardList.appendChild(li);
            });
        }
        else{
            console.log(result.error);
        }
    }catch(err){
        console.log("Leaderboard fetch error: "+err);
    }
}

async function fetchPlayerHighscore(gameName) {
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                action: "fetch_highscore",
                gameName: gameName
            }),
            credentials: "include" //includes session cookie
        });

        const result = await response.json();

       if(result.status == "success"){
        console.log("playerhighscore:"+result.player_highscore);
        return result.player_highscore;
       }

    }catch (err) {
                console.log("Failed to send score to server: "+err);
            }
}
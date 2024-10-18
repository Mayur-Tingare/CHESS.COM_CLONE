const express=require("express");

const socket=require("socket.io")
const http=require("http")
const {Chess}=require("chess.js")
const path=require("path");
const { title, disconnect } = require("process");

const app=express();

const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();

let players={};

let curretnPlayer="w";

app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
    res.render("index",{title:"Chess Game"});
})

io.on("connection", function(uniquesocket){
    console.log("connected");

    if(!players.white){
        players.white=uniquesocket.id;
        uniquesocket.emit("playerRole","w");
    }
    else if(!players.black){
        players.black=uniquesocket.id;
        uniquesocket.emit("playerRole","b")
    }
    else{
        uniquesocket.emit("spectatorRole")
    }


    uniquesocket.on("disconnect",function(){
        if(uniquesocket.id===players.white){
            delete players.white;

            // game band krdo
        }
        else if(uniquesocket.id===players.black){
            delete players.white;

            // game band krdo
        }
        

    })
    uniquesocket.on("move",function(move){
        try{

            if(chess.turn==="w" && uniquesocket.id!==players.white) return;
            if(chess.turn==="b" && uniquesocket.id!==players.blcak) return;

            const result=chess.move(move);
            if(result){
                curretnPlayer=chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen());
            }
            else{
                console.log("INVALID MOVE :",move);
                uniquesocket.emit("Invalid Move :" ,move);
            }

        }
        catch(err){
            console.log(err);
            uniquesocket.emit("INVALID MOVE :",move);
        }
    })


});

server.listen(3000,function(){
    console.log("Listening");
    
})
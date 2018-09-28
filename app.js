var express=require('express')
var app=express();
var server=require('http').Server(app);
var bodyParser=require('body-parser');
var io=require('socket.io')(server);
// parse application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
var port=proces.env.PORT||3000;

app.use(express.static(__dirname + '/public'))
var originalcharacters=['goku', 'doremon', 'batman', 'spiderman' , 'harrypotter', 'vegeta', 'pikachu' ,'hulk' , 'bheem',' nobita ']
var characters=originalcharacters

var rooms=[];
app.get('/' , function(req,res){ res.sendFile(__dirname + '/index.html')})
app.post('/joinTheRoom', function(req,res){
    console.log('reached here')
    console.log(req.body);
roomName=req.body.roomName;



rooms.forEach(function(room)
{
    if(room.roomname==roomName&&room.index<=10){
        res.sendStatus(200)
        return;
    }
  
})
 res.sendStatus(204);
  



})

var roomindex=0;

app.post('/getSocketId', function(req,res)
{
    // console.log('reached here' + '42');
    // console.log(req.body);
    // console.log(rooms);
roomName=req.body.roomName;
rooms.forEach(function(room)
{
    console.log(room + '48')
    if(room.roomname==roomName)
    {
     
        res.send(characters[room.index]);
   room.index++;
    }

}
)
console.log(rooms)
})
app.post('/createTheRoom', function(req,res){
    console.log('reached here' + '58')
    console.log(req.body);
roomName=req.body.roomName;
if(rooms.length>0)
{
rooms.forEach(function(room)
{
    if(room.roomname==roomName)
    {
        res.sendStatus(204);
        return;
    }
})
}

rooms[roomindex]={
    roomname: roomName,
    index : 0
}

roomindex++;
console.log(rooms)
res.sendStatus(200)
})



io.on('connection' , function(socket){

var socketId=socket.id;
socket.on('joinTheRoom' , function(roomname)
{
    socket.join(roomname , function(){ console.log('joined')
    var clients=io.nsps['/'].adapter.rooms[roomname];
var duplicate=characters;
var duplicateIndex=0;
socket.finalRoom=roomname
rooms.forEach(  function(room)
{
    if(room.roomname==roomname)
    {
duplicateIndex=room.index;
duplicate=duplicate.slice(0, duplicateIndex);
console.log(duplicate);

io.to(roomname).emit('newUserConnected', clients, duplicate)

    }
})

})
})
socket.on('chatMessage', function(message, roomname,userName)
{
socket.broadcast.to(roomname).emit('newMessageRecieved', message,userName)
})

socket.on('disconnect' , function(){ console.log('user disconnected')

rooms.forEach(function(room ,Index){  
    if(room.roomname==socket.finalRoom)
    {
       
    
   if(!io.nsps['/'].adapter.rooms[room.roomname])
   {
       console.log('empty room')
rooms.splice(Index,1);

   }
    }
    
    
      })


io.emit('userDisconnected', socketId);

}
)

socket.on('deleteUser' , function(index,roomname,name)
{
rooms.forEach(function(room){  
if(room.roomname==roomname)
{
    var x=name.userId;
    tempIndex=characters.indexOf(name.userId);
var clientsLength=io.nsps['/'].adapter.rooms[roomname].length;
room.index=clientsLength
characters.splice(tempIndex,1);
characters.push(x);

duplicate=characters.slice(0,room.index);
var clients=io.nsps['/'].adapter.rooms[roomname];

io.to(roomname).emit('userRemoved' , clients, duplicate);

}


  })


})

socket.on('getTotalClients' , function(roomName) { 

   var clients= io.nsps['/'].adapter.rooms[roomName];
console.log(clients);
return clients;
} )


socket.on('TypingUser', function(userName,roomname)
{
    socket.broadcast.to(roomname).emit('userIsTyping' , userName);
})




})






server.listen(port, function(){ console.log('server has started')})